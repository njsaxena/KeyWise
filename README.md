# KeyWise

KeyWise is an AI‑powered real estate marketing companion that helps homeowners transform raw property information into polished, high‑impact listings. Instead of wrestling with writing, social posts, and staging decisions, owners follow a guided workflow that turns photos and basic details into professional materials ready for buyers.

## Overview

Selling a home requires far more than placing a “For Sale” sign in the yard. Presentation, clarity, and consistency across platforms strongly influence both interest and offers. KeyWise reduces the friction of this process by combining a structured intake experience with modern AI tooling, giving non‑experts the ability to prepare marketing assets that feel as though they were produced by a seasoned listing agent.

The application focuses on three stages of the journey: gathering the essentials about a property, using AI to synthesize that information, and returning concise, editable outputs that the seller can refine and publish wherever they choose.

## Core Features

- **Guided property upload:** Owners enter foundational information such as square footage, bedroom and bathroom counts, and general property attributes, while also uploading photos that represent the space accurately.
- **AI‑generated listing copy:** The system produces MLS‑ready descriptions which highlight distinctive features, emphasize upgrades, and maintain a consistent, professional tone across every section.
- **Social media marketing content:** For sellers who want to promote their home beyond traditional listing portals, the app can produce tailored captions and blurbs suitable for platforms such as Facebook, Instagram, and event pages for open houses.
- **Staging guidance from photos:** Based on uploaded images, KeyWise suggests small, concrete adjustments that can improve perceived value, reduce visual clutter, and make rooms feel more welcoming in both in‑person showings and online galleries.
- **Interactive learning support:** A built‑in chat experience allows users to ask questions about the selling and marketing process, receiving contextual guidance rather than generic advice.
- **Full editorial control:** Every generated artifact can be reviewed, edited, and adjusted before publication, ensuring that homeowners remain the final decision‑makers for how their property is presented.

## Architecture and Technology

KeyWise is built as a modern TypeScript‑first web application using the following stack:

- **Framework:** Next.js (App Router), providing server‑side rendering and a flexible routing model suitable for marketing pages and authenticated experiences.
- **Language and runtime:** TypeScript with React, enabling strongly typed UI components and predictable state management.
- **Styling and UI:** Tailwind CSS combined with shadcn/ui and Radix primitives to achieve consistent, accessible design with reusable components.
- **Authentication:** Clerk integration to manage sign‑up, sign‑in, and session handling with minimal custom boilerplate.
- **Data and persistence:** Supabase client libraries for interacting with backend services and storing user‑specific data where required.
- **AI integration:** OpenAI APIs, accessed through the official `openai` SDK, to generate listing descriptions, marketing copy, and guidance based on user‑supplied prompts and images.
- **Tooling:** ESLint for linting, TypeScript for type checking, and a standard Next.js build pipeline targeting Vercel deployment.

This combination offers a balance between developer velocity, type safety, and the flexibility needed to experiment with new prompts, flows, and AI‑driven features.

## Live Demo

You can try KeyWise in the browser:

- Public marketing site and onboarding: [keywise.org](https://keywise.org)

You can create an account, upload property details, and generate listing materials directly from the web interface.


## Getting Started

To run the project locally, you will need a recent Node.js environment and either `npm` or another compatible package manager.

1. **Install dependencies**

   From the `keywise` directory, install the project dependencies:

   ```bash
   npm install

2. **Configure environment variables**

  Create a ‎`.env.local` file in the ‎`keywise` folder and populate it with the secrets required by Clerk, Supabase,     and OpenAI. Typical values include items such as:
  
   ▫ API key for your OpenAI account.
  
   ▫ Frontend and backend keys for your Supabase project.
  
   ▫ Public and secret keys for your Clerk application. Exact variable names depend on how you configure providers        within the codebase; align them with the values referenced wherever environment variables are read.

3. **Run the development server**

  Start the local development environment with:
  
  ```bash
  npm run dev
  
  ```
  
  Then open ‎`http://localhost:3000` in your browser. Changes under the ‎`app` and ‎`components` directories will         hot‑reload as you edit them.
  
4. **Build and run in production mode**

  To verify a production build locally, run:
  
  ```bash
  npm run build
  npm start
  
  ```
  
  This sequence compiles the Next.js application and serves the optimized output using the default port                configuration.

**Project Structure** ￼

The main application code lives in the ‎`keywise` directory and is organized to keep domain logic, UI components, and infrastructure concerns relatively distinct.

- The ‎`app` folder defines routes, layouts, and page‑level server components.

- The ‎`components` directory contains shared UI elements and feature‑specific composites.

- The ‎`data`, ‎`lib`, and ‎`types` directories collect utilities, shared logic, and TypeScript types that support both frontend and integration code.

- The ‎`supabase` directory holds configuration and helpers for interacting with Supabase services.

- Public assets such as images, icons, and static files are stored under ‎`public`.

This structure aims to keep the listing experience cohesive while leaving room for future modules related to analytics, agent collaboration, or additional marketing channels.

**Development Notes** ￼

KeyWise is intended as an educational, experimental tool for exploring AI‑assisted real estate marketing workflows. It does not replace licensed professional advice and should not be treated as a source of legal or financial guidance. Any use in a real transaction should be accompanied by independent review from qualified professionals.

Contributions that improve prompts, refine UX flows, or enhance provider integrations are welcome. The codebase favors clear, well‑documented components over overly clever abstractions, so new changes should preserve that emphasis on readability.

