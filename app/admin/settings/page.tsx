import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
        <p className="text-slate-500 mt-2">Manage global settings for your learning platform.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-8">
        {/* General Settings */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">General</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="EduStream" className="max-w-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Support Email</Label>
              <Input id="contactEmail" type="email" defaultValue="support@example.com" className="max-w-sm" />
            </div>
          </div>
        </div>

        {/* Branding Settings */}
        <div>
           <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Branding</h2>
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary text-white flex items-center justify-center">
                   <span className="material-symbols-outlined text-3xl">school</span>
                </div>
                <div className="space-y-2">
                  <Label>Brand Logo</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-slate-200 text-slate-600">Upload Logo</Button>
                    <p className="text-xs text-slate-500">Recommended size: 200x200px</p>
                  </div>
                </div>
              </div>
           </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button variant="outline" className="border-slate-200">Discard Changes</Button>
          <Button className="bg-primary text-white">Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
