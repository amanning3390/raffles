# Create a Mini App

> Quickly create a mini app, sign a manifest, and publish to the Base app.

**Prerequisites**

* Base app account
* [Vercel](https://vercel.com/) account for hosting the application

<Panel>
  <iframe className="w-3/4 aspect-video rounded-xl mx-auto block" src="https://www.youtube-nocookie.com/embed/vLnugincHAg?si=I_jyZxSzVe32nuC5" title="Create a new mini app in under 10 mins" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen />
</Panel>

<Steps>
  <Step title="Deploy Template">
    Click the button below and follow the prompts to deploy the quickstart template to Vercel.

    <Card title="Deploy to Vercel" icon="rocket" href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbase%2Fdemos%2Ftree%2Fmaster%2Fmini-apps%2Ftemplates%2Fminikit%2Fnew-mini-app-quickstart&project-name=new-mini-app-quickstart&repository-name=new-mini-app-quickstart&env=NEXT_PUBLIC_PROJECT_NAME&demo-title=New%20Mini%20App&demo-description=Quickstart%20waitlist%20mini%20app%20with%20MiniKit%20on%20Base" horizontal>
      Rapidly deploy the quickstart template to Vercel to get started.
    </Card>
  </Step>

  <Step title="Clone your repository">
    Clone the repo created by Vercel to make local edits.

    Replace `<your-username>` with your github username.

    ```bash Terminal theme={null}
    git clone https://github.com/<your-username>/new-mini-app-quickstart
    cd new-mini-app-quickstart
    npm install
    ```
  </Step>

  <Step title="Update Manifest configuration">
    The `minikit.config.ts` file is responsible for configuring your manifest located at `app/.well-known/farcaster.json` and creating embed metadata.

    <Tip> You can customize the manifest by updating the `miniapp` object.</Tip>

    For details on each field, see the [field reference](/mini-apps/features/manifest#field-reference).

    ```ts minikit.config.ts theme={null}
    export const minikitConfig = {
      accountAssociation: { // this will be added in step 5
        "header": "",
        "payload": "",
        "signature": ""
      },
      miniapp: {
        version: "1",
        name: "Cubey", 
        subtitle: "Your AI Ad Companion", 
        description: "Ads",
        screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
        iconUrl: `${ROOT_URL}/blue-icon.png`,
        splashImageUrl: `${ROOT_URL}/blue-hero.png`,
        splashBackgroundColor: "#000000",
        homeUrl: ROOT_URL,
        webhookUrl: `${ROOT_URL}/api/webhook`,
        primaryCategory: "social",
        tags: ["marketing", "ads", "quickstart", "waitlist"],
        heroImageUrl: `${ROOT_URL}/blue-hero.png`, 
        tagline: "",
        ogTitle: "",
        ogDescription: "",
        ogImageUrl: `${ROOT_URL}/blue-hero.png`,
      },
    } as const;
    ```
  </Step>

  <Step title="Create accountAssociation Credentials">
    Now that you have a public domain for your application, you are ready to associate your mini app with your Farcaster account.

    1. Ensure all changes are live by pushing changes to the `main` branch.
       <Tip>Ensure that Vercel's **Deployment Protection** is off by going to the Vercel dashboard for your project and navigating to Settings -> Deployment Protection and toggling "Vercel Authentication" to off and click save. </Tip>

    2. Navigate to the Base Build [Account association tool](https://www.base.dev/preview?tab=account).

    3. Paste your domain in the `App URL` field (ex: sample-url.vercel.app) and click "Submit"

    <img src="https://mintcdn.com/base-a060aa97/F2b0pmlGbdGjOPAu/images/base-build/sign-manifest.png?fit=max&auto=format&n=F2b0pmlGbdGjOPAu&q=85&s=70bec5b0b685b908db655187637abcc0" alt="Sign manifest" height="300" className="rounded-lg" data-og-width="1920" data-og-height="1048" data-path="images/base-build/sign-manifest.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/base-a060aa97/F2b0pmlGbdGjOPAu/images/base-build/sign-manifest.png?w=280&fit=max&auto=format&n=F2b0pmlGbdGjOPAu&q=85&s=5e298e5b70a7e65fdf9005cf6d818396 280w, https://mintcdn.com/base-a060aa97/F2b0pmlGbdGjOPAu/images/base-build/sign-manifest.png?w=560&fit=max&auto=format&n=F2b0pmlGbdGjOPAu&q=85&s=9a7af3ef5a828a1248757ce520336dfa 560w, https://mintcdn.com/base-a060aa97/F2b0pmlGbdGjOPAu/images/base-build/sign-manifest.png?w=840&fit=max&auto=format&n=F2b0pmlGbdGjOPAu&q=85&s=69d45dadc50377e3dbb9209d3d90e5c6 840w, https://mintcdn.com/base-a060aa97/F2b0pmlGbdGjOPAu/images/base-build/sign-manifest.png?w=1100&fit=max&auto=format&n=F2b0pmlGbdGjOPAu&q=85&s=146243666d25e818ffaf2e5c21e4c095 1100w, https://mintcdn.com/base-a060aa97/F2b0pmlGbdGjOPAu/images/base-build/sign-manifest.png?w=1650&fit=max&auto=format&n=F2b0pmlGbdGjOPAu&q=85&s=73b751caaf7f71b31cff9b462e62e3f9 1650w, https://mintcdn.com/base-a060aa97/F2b0pmlGbdGjOPAu/images/base-build/sign-manifest.png?w=2500&fit=max&auto=format&n=F2b0pmlGbdGjOPAu&q=85&s=1e49d69f320478f6a1ad1a9aeca1767f 2500w" />

    4. Click on the "Verify" button that appears and follow the instructions to generate the `accountAssociation` fields.
    5. Copy the `accountAssociation` object
  </Step>

  <Step title="Update `minikit.config.ts`">
    Update your `minikit.config.ts` file to include the `accountAssociation` object you copied in the previous step.

    ```ts minikit.config.ts theme={null}
    export const minikitConfig = {
        accountAssociation: {
            "header": "eyJmaBBiOjE3MzE4LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4NzYwQjA0NDc5NjM4MTExNzNmRjg3YDPBYzA5OEJBQ0YxNzNCYkU0OCJ9",
            "payload": "eyJkb21haW4iOiJ4BWl0bGlzdC1xcy52ZXJjZWwuYXBwIn7",
            "signature": "MHhmNGQzN2M2OTk4NDIwZDNjZWVjYTNiODllYzJkMjAwOTkyMDEwOGVhNTFlYWI3NjAyN2QyMmM1MDVhNzIyMWY2NTRiYmRlZmQ0NGQwOWNiY2M2NmI2B7VmNGZiMmZiOGYzNDVjODVmNmQ3ZTVjNzI3OWNmMGY4ZTA2ODYzM2FjZjFi"
        },
        miniapp: {
            ...
        },
      }
    ```
  </Step>

  <Step title="Push updates to production">
    Push all changes to the `main` branch. Vercel will automatically deploy the changes to your production environment.
  </Step>

  <Step title="Preview Your App">
    Go to [base.dev/preview](https://base.dev/preview) to validate your app.

    1. Add your app URL to view the embeds and click the launch button to verify the app launches as expected.
    2. Use the "Account association" tab to verify the association credentials were created correctly.
    3. Use the "Metadata" tab to see the metadata added from the manifest and identify any missing fields.

    <video autoPlay muted loop playsInline src="https://mintcdn.com/base-a060aa97/hlNNNlUJtlshvXQM/videos/mini-apps/basebuildpreview.mp4?fit=max&auto=format&n=hlNNNlUJtlshvXQM&q=85&s=65a4cb8ce13c9940cba6aee73b8ececb" data-path="videos/mini-apps/basebuildpreview.mp4" />
  </Step>

  <Step title="Post to Publish">
    To publish your app, create a post in the Base app with your app's URL.

    <img src="https://mintcdn.com/base-a060aa97/t8Sjfqig2G4AU7Gh/images/minikit/publish-app-base.png?fit=max&auto=format&n=t8Sjfqig2G4AU7Gh&q=85&s=71a07b27f04a4df65f47fced5b2b76a5" alt="Posting an app to Base app" height="300" className="rounded-lg" data-og-width="1143" data-og-height="1380" data-path="images/minikit/publish-app-base.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/base-a060aa97/t8Sjfqig2G4AU7Gh/images/minikit/publish-app-base.png?w=280&fit=max&auto=format&n=t8Sjfqig2G4AU7Gh&q=85&s=aa2a25afd0e22fad807642a6753446fc 280w, https://mintcdn.com/base-a060aa97/t8Sjfqig2G4AU7Gh/images/minikit/publish-app-base.png?w=560&fit=max&auto=format&n=t8Sjfqig2G4AU7Gh&q=85&s=187a5bdceb902dbfb0714088301bb58e 560w, https://mintcdn.com/base-a060aa97/t8Sjfqig2G4AU7Gh/images/minikit/publish-app-base.png?w=840&fit=max&auto=format&n=t8Sjfqig2G4AU7Gh&q=85&s=8e731221f349c80283e57ee3fddd5827 840w, https://mintcdn.com/base-a060aa97/t8Sjfqig2G4AU7Gh/images/minikit/publish-app-base.png?w=1100&fit=max&auto=format&n=t8Sjfqig2G4AU7Gh&q=85&s=fa5af302bc79f138a4989c91fb5f4c6b 1100w, https://mintcdn.com/base-a060aa97/t8Sjfqig2G4AU7Gh/images/minikit/publish-app-base.png?w=1650&fit=max&auto=format&n=t8Sjfqig2G4AU7Gh&q=85&s=90bbb4dbaea6ce60b0fc145348888ded 1650w, https://mintcdn.com/base-a060aa97/t8Sjfqig2G4AU7Gh/images/minikit/publish-app-base.png?w=2500&fit=max&auto=format&n=t8Sjfqig2G4AU7Gh&q=85&s=66414a12494828300cad19fef435b18c 2500w" />
  </Step>
</Steps>
