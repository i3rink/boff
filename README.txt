BOFF - deploy bundle
====================

Files in here:
  index.html                  the app (add your Supabase keys, see step 1)
  manifest.webmanifest        makes it installable as a phone app
  sw.js                       offline support
  icon-192.png / icon-512.png / apple-touch-icon.png   app icons
  daybook-supabase-setup.sql  run once in Supabase to create your tables

------------------------------------------------------------
1. Add your Supabase keys
------------------------------------------------------------
Open index.html in any text editor. Near the top of the <script> block
find the CONFIG section and paste your two values from Supabase
(Project Settings > API):

  var SUPABASE_URL = "https://xxxx.supabase.co";
  var SUPABASE_ANON_KEY = "your-anon-public-key";

Save.

------------------------------------------------------------
2. Create the database tables
------------------------------------------------------------
In Supabase open the SQL Editor, paste the whole of
daybook-supabase-setup.sql, and Run. Once only.

------------------------------------------------------------
3. Lock it to you
------------------------------------------------------------
Supabase > Authentication. Make sure Email is on. Optional but worth it:
turn off "Confirm email" for instant first sign-in, and turn off new
sign-ups once your own account exists.

------------------------------------------------------------
4. Put it online with Render
------------------------------------------------------------
Push this whole folder to a (private) GitHub repo. In Render choose
New > Static Site, connect the repo, leave the build command blank,
set the publish directory to the repo root, and create it.

Open the Render URL on each device and sign in.

------------------------------------------------------------
5. Install it as an app
------------------------------------------------------------
iPhone / iPad (Safari): Share > Add to Home Screen.
Android / Samsung (Chrome): menu > Install app / Add to Home screen.
Desktop (Chrome/Edge): the install icon in the address bar.

The PWA features (install, offline) only work on the Render URL,
not when opening the file straight off disk.
