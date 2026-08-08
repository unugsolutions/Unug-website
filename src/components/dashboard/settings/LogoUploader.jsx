import ImageUploader from "../ImageUploader"
import { uploadLogo, uploadFavicon, uploadSEOImage } from "../../../services/settingsService"

const UPLOADERS = {
  logo: uploadLogo,
  favicon: uploadFavicon,
  seo: uploadSEOImage,
}

export default function LogoUploader({ kind, label, value, onChange, hint }) {
  const upload = UPLOADERS[kind]
  if (!upload) return null
  return (
    <ImageUploader
      label={label}
      value={value || ""}
      onChange={onChange}
      onUpload={upload}
      hint={hint || "PNG, JPG, WEBP, GIF, SVG or AVIF up to 10 MB"}
      emptyNote={`No ${label.toLowerCase()} uploaded yet.`}
    />
  )
}
