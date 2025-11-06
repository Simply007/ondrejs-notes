# TinyMCE Notes

* TinyMCE: https://www.tiny.cloud/
* One of the oldest WYSIWYG editors (since 2004)
* Self-hosted or cloud-hosted with API key
* Complete UI provided out of the box
* Lower time to "Hello World" - works immediately with minimal config
* Extensive plugin ecosystem (40+ official plugins)
* Free tier available but many features require paid plans (premium plugins, cloud features)
* Nice touch: when you don't have the API key - you get the nice message to add it instead of broken editor

## Key Features

* **Plugins**: `advlist`, `autolink`, `lists`, `link`, `image`, `charmap`, `preview`, `anchor`, `searchreplace`, `visualblocks`, `code`, `fullscreen`, `insertdatetime`, `media`, `table`, `help`, `wordcount`, `emoticons`, `codesample`, `quickbars`
* **Toolbar**: Fully customizable with string-based configuration
* **Self-hosted**: Can use without API key (set `apiKey: "no-api-key"`)
* **Branding**: Can be disabled with `branding: false` and `promotion: false`

## Architecture

* Traditional monolithic editor (not headless)
* DOM-based editing (not virtual document model like ProseMirror)
* Event-driven API with lifecycle hooks
* Editor instance via `onInit` callback
* Content updates via `onEditorChange` callback

## Comparison with Other Editors

**vs CKEditor**:
- Similar approach (complete WYSIWYG with UI)
- TinyMCE: simpler config, faster setup
- CKEditor: more modern, better collaboration features

**vs TipTap**:
- TinyMCE: complete UI, no customization needed
- TipTap: headless, full UI control, steeper learning curve

**vs ContentEditable**:
- TinyMCE: battle-tested, consistent across browsers
- ContentEditable: full control, zero dependencies, many edge cases

## Pros

* Fast setup with sensible defaults
* Extensive documentation and community
* Wide browser support and mobile compatibility
* Professional UI without custom implementation
* Mature and stable (20+ years development)

## Cons

* Larger bundle size (~500KB minified)
* Premium features require subscription
* Less flexible than headless editors (TipTap)
* DOM-based architecture (harder to customize deeply)
* Cloud features require API key and internet connection
