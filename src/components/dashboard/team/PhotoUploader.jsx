import ImageUploader from "../ImageUploader"

export default function PhotoUploader(props) {
  return (
    <ImageUploader
      label="Profile Photo"
      hint="PNG, JPG, WEBP or SVG up to 10 MB"
      emptyNote="No photo yet — a placeholder avatar is shown on the website."
      {...props}
    />
  )
}
