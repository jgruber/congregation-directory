# Google OAuth verification

What Google's Third-Party Data Safety team needs to verify the Calendar scope for
Congregation Directory, and the text to paste into the Cloud Console.

- **Project:** `congregation-directory-503715` (number 687021527199)
- **App:** https://congregation-directory.grubernet.org/
- **Homepage:** https://congregation-directory.grubernet.org/home.html
- **Privacy policy:** https://congregation-directory.grubernet.org/privacy.html
- **Brand verification:** approved 2026-08-03
- **Sensitive scope requested:** `https://www.googleapis.com/auth/calendar.events.owned`
- **Non-sensitive scope:** `https://www.googleapis.com/auth/userinfo.email`

The app previously requested `calendar.events`. Google rejected that on 2026-11-24 for least
privilege: the app only creates events on the user's own primary calendar, so it now requests
`calendar.events.owned` instead (`GCAL_SCOPES` in `index.html`).

## 1. Cloud Console: data access (scopes)

Google Auth Platform → **Data Access**:

1. Remove `.../auth/calendar.events`.
2. Add `.../auth/calendar.events.owned` and keep `.../auth/userinfo.email`.
3. Save. The configured scopes must exactly match what the app requests.

## 2. Scope justification (paste into the console)

> Congregation Directory lets a congregation coordinator create one Google Calendar event that
> invites the members they selected in the app (for example, a meeting or a follow-up
> deadline). When the user clicks "Create & send invites", the app makes a single
> `events.insert` call on the signed-in user's own primary calendar with `sendUpdates=all`,
> so Google sends the invitations. The app never reads, lists, edits or deletes events, and
> never accesses calendars the user does not own. `calendar.events.owned` is the narrowest
> scope that allows creating an event: the read-only and free/busy scopes cannot create
> events, and `calendar.app.created` only covers secondary calendars the app creates, while
> invitations need to come from the user's own calendar. Google data is used only in the
> user's browser, is never sent to the developer, and is not stored beyond a short-lived
> access token in the browser.

## 3. Demo video

Upload to YouTube as **Unlisted** (not Private: reviewers must be able to open the link
without signing in). Check the link in a private browser window before submitting. Record in
English, at a readable resolution, with the browser address bar visible throughout.

**Make sure the consent screen appears.** Google skips it for an account that has
already granted access, so a video recorded after an earlier test shows no consent screen (this
is why the 2026-11-26 review was returned). Before recording:

1. Remove the app's access at https://myaccount.google.com/connections (find "Congregation
   Directory" and delete all connections).
2. Record in a new **Incognito** (or Guest) window, so the app has no saved sign-in and asks
   Google for consent.

Shot list:

1. Open https://congregation-directory.grubernet.org/ and show the address bar. Scroll the
   start screen to show the app name, its purpose and "How Congregation Directory uses Google
   data".
2. Click **Or try it with sample data**. Twelve fictitious people load.
3. Optionally filter (for example, choose field service group "Group North") to show that
   the event invites the people currently displayed.
4. Open **Actions** (⋮ in the top bar) → **Add Google Calendar Event…**.
5. **Consent screen (required):** the Google sign-in opens. Pick the account. Show the app name and the developer details,
   and if the permissions are collapsed click **"Show all services"** / expand them so
   "See, create, change, and delete events on Google calendars you own" is fully readable.
   Tick it and continue.
6. Back in the app, show "Signed in as …", fill in the event title, deadline, duration and
   reminder, and click **Create & send invites**. Show the "Event created — invited N" message.
7. **Source account impact:** open https://calendar.google.com/ in the same account, open
   the new event and show its title, time and guest list (the selected people).
8. Optional: invite an inbox you control (add a person with your own address via your own
   CSV, or use the sample data) and show the invitation email arriving.

## 4. Test instructions for the reviewer (paste into the reply)

> No account or login is needed for the app itself, and no test credentials are required.
>
> 1. Open https://congregation-directory.grubernet.org/
> 2. On the start screen click "Or try it with sample data". This loads 12 fictitious people
>    (example.com addresses); no real data is involved.
> 3. Open the "Actions" menu (⋮ in the top bar) and choose "Add Google Calendar Event…".
> 4. Sign in with any Google account and grant "See, create, change, and delete events on
>    Google calendars you own".
> 5. Enter a title and a deadline date, then click "Create & send invites".
> 6. Open Google Calendar for that account: the event is on the primary calendar with the
>    displayed people as guests.
>
> Invitations to the sample example.com addresses cannot be delivered; that is expected.

## 5. Privacy policy: data protection

Google requires the privacy policy of an app with sensitive scopes to describe its data
protection mechanisms. That is the "How your data is protected" section of
https://congregation-directory.grubernet.org/privacy.html (added 2026-11-26).

## 6. Resubmit

1. In the Cloud Console, Google Auth Platform → **Verification Center**, start the
   verification again with the new video link and the justification above. Keep the
   publishing status **In production**.
2. Reply to Google's email ("[Action Needed] OAuth Verification Request Acknowledgement")
   with the video link and the test instructions from section 4.
