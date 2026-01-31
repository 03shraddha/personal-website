# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Shraddha Kulkarni. Static site deployed to GitHub Pages at shraddha-kulkarni.com.

## Development

No build process required. Open `index.html` in a browser to preview changes locally. Push to `main` branch to deploy via GitHub Pages.

## Architecture

**Frontend (Static Files)**
- `index.html` - Page structure and sections (hello, about, work, thoughts, content, photos, guestbook)
- `styles.css` - All styling including responsive breakpoints and CSS custom properties
- `script.js` - All interactivity: navigation, tabs, modals, Supabase integration, admin mode
- `content.js` - Editable content data (text, experiences, projects, communities, social links)

**Backend (Supabase)**
- `supabase-setup.sql` - Database schema for tables: `guestbook_notes`, `photos`, `page_views`, `content_entries`
- Supabase credentials are in `script.js` (anon key is public by design)

## Content Updates

Edit `content.js` to update website text. Key sections:
- `RESUME_URL` constant at top - updates resume link site-wide
- `CONTENT.helloIntro` - Landing page intro text
- `CONTENT.experiences` - Work history with expanded content
- `CONTENT.projects` - Project cards
- `CONTENT.socialLinks` - Social media URLs

## Admin Mode

Access admin features (add photos, content entries) by:
1. Navigate to `?admin=shraddha`
2. Enter password when prompted
3. Logout via `?admin=logout`

Admin state stored in localStorage as `admin-authenticated`.

## Database Tables

- `guestbook_notes` - Anonymous visitor messages
- `photos` - Polaroid gallery with base64 images
- `page_views` - View counter
- `content_entries` - Calendar content (articles, videos, podcasts)

## CSS Variables

Theme colors defined at top of `styles.css` using `--color-*` custom properties. Highlight colors: `peach`, `blue`, `lavender`.
