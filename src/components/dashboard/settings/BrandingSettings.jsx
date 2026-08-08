import { SectionCard, SectionTitle } from "./fields"
import LogoUploader from "./LogoUploader"
import ColorPicker from "./ColorPicker"
import ImagePreview from "./ImagePreview"

export default function BrandingSettings({ watch, setValue }) {
  const logo = watch("logo_url")
  const favicon = watch("favicon_url")
  const metaImage = watch("meta_image")

  const set = (name) => (value) => setValue(name, value, { shouldDirty: true })

  return (
    <div className="space-y-4">
      <SectionCard>
        <SectionTitle
          title="Brand Assets"
          description="Upload your logo, favicon, and social sharing image. Changes apply to the website after saving."
        />
        <div className="grid sm:grid-cols-3 gap-5">
          <LogoUploader kind="logo" label="Company Logo" value={logo} onChange={set("logo_url")} />
          <LogoUploader kind="favicon" label="Favicon" value={favicon} onChange={set("favicon_url")} />
          <LogoUploader kind="seo" label="SEO Image" value={metaImage} onChange={set("meta_image")} />
        </div>
        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="text-xs font-semibold text-[#0B1E3D] mb-3">Current Uploads</p>
          <ImagePreview
            items={[
              { label: "Logo", url: logo },
              { label: "Favicon", url: favicon },
              { label: "SEO Image", url: metaImage },
            ]}
          />
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle
          title="Brand Colors"
          description="Primary, secondary, and accent colors used across the public website."
        />
        <div className="grid sm:grid-cols-3 gap-5">
          <ColorPicker
            label="Primary"
            value={watch("primary_color")}
            onChange={set("primary_color")}
          />
          <ColorPicker
            label="Secondary"
            value={watch("secondary_color")}
            onChange={set("secondary_color")}
          />
          <ColorPicker
            label="Accent"
            value={watch("accent_color")}
            onChange={set("accent_color")}
          />
        </div>
      </SectionCard>
    </div>
  )
}
