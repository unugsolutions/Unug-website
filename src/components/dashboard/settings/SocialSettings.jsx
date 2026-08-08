import { SectionCard, SectionTitle, TextField } from "./fields"
import { socialLinksFromSettings } from "../../../lib/socialIcons"

export default function SocialSettings({ register, errors, watch }) {
  const socials = socialLinksFromSettings({ ...Object.fromEntries(["facebook", "linkedin", "instagram", "x", "youtube", "github", "whatsapp"].map((k) => [`${k}_url`, watch(`${k}_url`) || ""])) })
  const empty = socials.length === 0

  return (
    <SectionCard>
      <SectionTitle
        title="Social Media Links"
        description="Links shown in the footer. Empty links are hidden automatically."
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          register={register}
          name="facebook_url"
          label="Facebook"
          placeholder="https://facebook.com/yourpage"
          errors={errors}
        />
        <TextField
          register={register}
          name="linkedin_url"
          label="LinkedIn"
          placeholder="https://linkedin.com/company/yourpage"
          errors={errors}
        />
        <TextField
          register={register}
          name="instagram_url"
          label="Instagram"
          placeholder="https://instagram.com/yourpage"
          errors={errors}
        />
        <TextField
          register={register}
          name="x_url"
          label="X (Twitter)"
          placeholder="https://x.com/yourpage"
          errors={errors}
        />
        <TextField
          register={register}
          name="youtube_url"
          label="YouTube"
          placeholder="https://youtube.com/@yourchannel"
          errors={errors}
        />
        <TextField
          register={register}
          name="github_url"
          label="GitHub"
          placeholder="https://github.com/yourorg"
          errors={errors}
        />
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100">
        <p className="text-xs font-semibold text-[#0B1E3D] mb-3">
          Visible Footer Icons{" "}
          <span className="text-gray-400 font-normal">({socials.length} configured)</span>
        </p>
        {empty ? (
          <p className="text-xs text-gray-400">
            No social links configured yet. The social icons will appear in the footer once you add a link.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <span
                key={s.key}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F7F9FC] border border-gray-100 text-xs font-medium text-[#0B1E3D]"
              >
                <svg className="w-4 h-4 fill-current text-[#0057D9]" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
                {s.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  )
}
