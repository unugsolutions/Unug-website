import { SectionCard, SectionTitle, TextField, TextAreaField, Toggle } from "./fields"

export default function GeneralSettings({ register, errors, watch, setValue }) {
  return (
    <div className="space-y-4">
      <SectionCard>
        <SectionTitle
          title="General Information"
          description="Core identity of your company, shown across the website."
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            register={register}
            name="company_name"
            label="Company Name"
            placeholder="UNUG Solutions"
            errors={errors}
          />
          <TextField
            register={register}
            name="company_tagline"
            label="Company Tagline"
            placeholder="Engineering Digital Solutions"
            errors={errors}
          />
          <div className="sm:col-span-2">
            <TextField
              register={register}
              name="website"
              label="Website URL"
              placeholder="https://example.com"
              errors={errors}
            />
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <TextAreaField
            register={register}
            name="company_description"
            label="Company Description"
            rows={4}
            placeholder="Short description used in the footer and on the homepage..."
            errors={errors}
          />
          <TextAreaField
            register={register}
            name="mission"
            label="Mission"
            rows={3}
            placeholder="Your company mission statement..."
            errors={errors}
          />
          <TextAreaField
            register={register}
            name="vision"
            label="Vision"
            rows={3}
            placeholder="Your company vision statement..."
            errors={errors}
          />
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle
          title="Availability"
          description="Control whether the public website is live or under maintenance."
        />
        <Toggle
          label="Maintenance Mode"
          description="When enabled, visitors see a maintenance page instead of the website. Admins can still access the dashboard."
          checked={watch("maintenance_mode")}
          onChange={(value) => setValue("maintenance_mode", value, { shouldDirty: true })}
        />
      </SectionCard>
    </div>
  )
}
