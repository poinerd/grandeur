import MatterClient from "./MatterClient"
import { getGalleryAssets } from "./Gallery"
// Server component: gallery.ts uses `fs`, which only works on the server.
// The assets are read here and passed down to the client component.
export default function Matter() {
    return <MatterClient assets={getGalleryAssets()} />
}
