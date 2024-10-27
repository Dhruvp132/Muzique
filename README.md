Muzique (2024) 🎶
=================

**Muzique** is a collaborative music streaming SaaS platform where users can join a live stream, add songs to a playlist, vote on tracks, and influence the queue in real-time. A "pay-to-play" feature integrated with Stripe allows users to prioritize songs, giving stream creators a monetization opportunity.

Technologies & Frameworks
-------------------------

-   **Frontend**: Next.js, Tailwind CSS
-   **Backend**: Next.js API routes, Prisma ORM
-   **Database**: PostgreSQL
-   **Payment Processing**: Stripe
-   **Programming Language**: TypeScript

## Demo Video

[![Watch the demo video](https://via.placeholder.com/150)](https://drive.google.com/file/d/1yyzFFe-qZ8xw1_UGXKmLfKlM94GJpFTf/view?usp=drive_link)

> Click the image above to watch a demonstration of Muzique's key features on Google Drive.

Features
--------

-   **Collaborative Music Streaming**:

    -   Users can join streams, add songs to a shared queue, and upvote/downvote tracks to influence the playlist in real-time.
    -   Creator accounts allow control over streams and user interactions.
-   **Pay-to-Play**:

    -   Stripe integration supports card payments, Google Pay, and Apple Pay, enabling users to prioritize their preferred songs in the queue by making a payment.
    -   This monetization model adds interactivity and provides creators with a revenue stream.

Installation
------------

1.  **Clone the repository**:

    bash

    Copy code

    `git clone https://github.com/your-username/muzique.git
    cd muzique`

2.  **Install dependencies**:

    bash

    Copy code

    `npm install`

3.  **Set up environment variables**:

    -   Configure PostgreSQL, Stripe API keys, and any other required settings in a `.env` file.
4.  **Run database migrations**:

    bash

    Copy code

    `npx prisma migrate dev`

5.  **Start the application**:

    bash

    Copy code

    `npm run dev`

Project Highlights
------------------

-   **Real-Time Queue Management**: Users add songs to a queue and vote in real-time, influencing the next song.
-   **Stripe Payment Integration**: Secure, multi-platform payments allow users to pay and prioritize songs.
-   **Scalable Architecture**: Next.js and PostgreSQL provide high performance and smooth user interactions.

Contributing
------------

We welcome contributions! Follow these steps:

1.  **Fork the repository**.
2.  **Create a feature branch**:

    bash

    Copy code

    `git checkout -b feature/your-feature`

3.  **Commit your changes**:

    bash

    Copy code

    `git commit -m "Add your message"`

4.  **Push to your branch**:

    bash

    Copy code

    `git push origin feature/your-feature`

5.  **Open a pull request**.

License
-------

This project is licensed under the MIT License.
