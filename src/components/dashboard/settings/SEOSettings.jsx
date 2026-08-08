import { SectionCard, SectionTitle, TextField, TextAreaField } from "./fields"
import LogoUploader from "./LogoUploader"
import SEOPreview from "./SEOPreview"

export default function SEOSettings({ register, errors, watch, setValue }) {
  return (
    <div className="space-y-4">
      <SectionCard>
        <SectionTitle
          title="Search Engine Optimization"
          description="Meta information used by search engines and social sharing. Watch the live preview below."
        />
        <div className="space-y-4">
          <TextField
            register={register}
            name="seo_title"
            label="SEO Title"
            placeholder="UNUG Solutions | Engineering Digital Solutions"
            hint={`${(watch("seo_title") || "").length}/60 characters — keep it under 60 for best results.`}
            errors={errors}
          />
          <TextAreaField
            register={register}
            name="seo_description"
            label="Meta Description"
            rows={3}
            placeholder="A concise summary of your website..."
            hint={`${(watch("seo_description") || "").length}/160 characters — keep it under 160 for best results.`}
            errors={errors}
          />
          <TextField
            register={register}
            name="seo_keywords"
            label="Meta Keywords"
            placeholder="software, web development, digital solutions"
            hint="Comma separated."
            errors={errors}
          />
          <TextField
            register={register}
            name="google_analytics_id"
            label="Google Analytics ID"
            placeholder="G-XXXXXXXXXX"
            errors={errors}
          />
          <TextField
            register={register}
            name="google_tag_manager_id"
            label="Google Tag Manager ID"
            placeholder="GTM-XXXXXXX"
            errors={errors}
          />
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle
          title="Open Graph Image"
          description="Image shown when your website is shared on social media."
        />
        <LogoUploader
          kind="seo"
          label="SEO Image"
          value={watch("meta_image")}
          onChange={(value) => setValue("meta_image", value, { shouldDirty: true })}
        />
      </SectionCard>

      <SEOPreview watch={watch} />
    </div>
  )
}
