-- Row-level security policies for KeyWise listings

alter table listings enable row level security;

create policy "Select own listings" on listings
  for select
  using (user_id = current_setting('request.jwt.claims.sub', true));

create policy "Insert own listings" on listings
  for insert
  with check (user_id = current_setting('request.jwt.claims.sub', true));

create policy "Update own listings" on listings
  for update
  using (user_id = current_setting('request.jwt.claims.sub', true))
  with check (user_id = current_setting('request.jwt.claims.sub', true));

create policy "Delete own listings" on listings
  for delete
  using (user_id = current_setting('request.jwt.claims.sub', true));
