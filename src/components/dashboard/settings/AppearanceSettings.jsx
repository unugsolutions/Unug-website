import { RotateCcw } from "lucide-react"
import { SectionCard, SectionTitle } from "./fields"
import ColorPicker from "./ColorPicker"
import WebsitePreview from "./WebsitePreview"
import { DEFAULT_COLORS } from "../../../services/settingsService"

export default function AppearanceSettings({ watch, setValue }) {
  const resetColors = () => {
    Object.entries(DEFAULT_COLORS).forEach(([name, value]) => {
      setValue(name, value, { shouldDirty: true })
    })
  }

  return (
    <div className="space-y-4">
      <SectionCard>
        <SectionTitle
          title="Theme"
          description="Define the website's color scheme. Changes apply to the public website after saving."
        />
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-5">
            <ColorPicker label="Primary" value={watch("primary_color")} onChange={(v) => setValue("primary_color", v, { shouldDirty: true })} />
            <ColorPicker label="Secondary" value={watch("secondary_color")} onChange={(v) => setValue("secondary_color", v, { shouldDirty: true })} />
            <ColorPicker label="Accent" value={watch("accent_color")} onChange={(v) => setValue("accent_color", v, { shouldDirty: true })} />
            <button
              type="button"
              onClick={resetColors}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0057D9] bg-[#0057D9]/10 hover:bg-[#0057D9]/15 rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default Colors
            </button>
          </div>
          <WebsitePreview watch={watch} />
        </div>
      </SectionCard>
    </div>
  )
}
