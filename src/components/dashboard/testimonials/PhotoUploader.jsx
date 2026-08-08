import ImageUploader from "../ImageUploader"

export default function PhotoUploader(props) {
  return (
    <ImageUploader
      label="Client Photo"
      hint="PNG, JPG, WEBP or SVG up to 5 MB"
      emptyNote="No photo yet — a placeholder avatar is shown on the website."
      {...props}
    />
  )
}
