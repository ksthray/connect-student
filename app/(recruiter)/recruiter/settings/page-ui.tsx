"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Bell, Lock, User, Mail } from "lucide-react";

export default function RecruiterSettings() {
  const [companySettings, setCompanySettings] = useState({
    companyName: "Tech Corp",
    industry: "Technology",
    website: "https://techcorp.com",
    location: "San Francisco, CA",
    employees: "100-500",
    foundedYear: "2010",
  });

  const [contactSettings, setContactSettings] = useState({
    email: "recruiter@techcorp.com",
    phone: "+1-555-0100",
    contactPerson: "John Smith",
    jobTitle: "Head of HR",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    applicationAlerts: true,
    weeklyReport: true,
    newFollowers: false,
    profileViews: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    lastPasswordChange: "2024-01-15",
  });

  const [passwordChange, setPasswordChange] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saveMessage, setSaveMessage] = useState("");

  const handleCompanySave = () => {
    setSaveMessage("Company settings saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleContactSave = () => {
    setSaveMessage("Contact settings saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
  };

  const handleNotificationSave = () => {
    setSaveMessage("Notification settings saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handlePasswordChange = () => {
    if (
      !passwordChange.currentPassword ||
      !passwordChange.newPassword ||
      !passwordChange.confirmPassword
    ) {
      setSaveMessage("Please fill in all password fields");
      return;
    }
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      setSaveMessage("New passwords do not match");
      return;
    }
    setSaveMessage("Password changed successfully!");
    setPasswordChange({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="space-y-8 p-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your company profile and account settings.
        </p>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          {saveMessage}
        </div>
      )}

      {/* Company Information */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">
            Company Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Company Name
            </label>
            <Input
              value={companySettings.companyName}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  companyName: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Industry
            </label>
            <Input
              value={companySettings.industry}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  industry: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Website
            </label>
            <Input
              value={companySettings.website}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  website: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <Input
              value={companySettings.location}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  location: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Company Size
            </label>
            <select
              value={companySettings.employees}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  employees: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 bg-white">
              <option value="1-10">1-10 employees</option>
              <option value="10-50">10-50 employees</option>
              <option value="50-100">50-100 employees</option>
              <option value="100-500">100-500 employees</option>
              <option value="500-1000">500-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Founded Year
            </label>
            <Input
              value={companySettings.foundedYear}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  foundedYear: e.target.value,
                })
              }
              className="border-border"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={handleCompanySave}
            className="bg-linear-to-r from-primary to-secondary text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">
            Contact Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <Input
              value={contactSettings.email}
              onChange={(e) =>
                setContactSettings({
                  ...contactSettings,
                  email: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <Input
              value={contactSettings.phone}
              onChange={(e) =>
                setContactSettings({
                  ...contactSettings,
                  phone: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Contact Person Name
            </label>
            <Input
              value={contactSettings.contactPerson}
              onChange={(e) =>
                setContactSettings({
                  ...contactSettings,
                  contactPerson: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Job Title
            </label>
            <Input
              value={contactSettings.jobTitle}
              onChange={(e) =>
                setContactSettings({
                  ...contactSettings,
                  jobTitle: e.target.value,
                })
              }
              className="border-border"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={handleContactSave}
            className="bg-linear-to-r from-primary to-secondary text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your account
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle("emailNotifications")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.emailNotifications
                  ? "bg-primary"
                  : "bg-gray-300"
              }`}>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.emailNotifications
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Application Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get alerts when new applications arrive
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle("applicationAlerts")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.applicationAlerts
                  ? "bg-primary"
                  : "bg-gray-300"
              }`}>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.applicationAlerts
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Weekly Report</p>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary of your activities
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle("weeklyReport")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.weeklyReport ? "bg-primary" : "bg-gray-300"
              }`}>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.weeklyReport
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">New Followers</p>
              <p className="text-sm text-muted-foreground">
                Get notified when companies follow you
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle("newFollowers")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.newFollowers ? "bg-primary" : "bg-gray-300"
              }`}>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.newFollowers
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Profile Views</p>
              <p className="text-sm text-muted-foreground">
                Get notified when your profile is viewed
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle("profileViews")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.profileViews ? "bg-primary" : "bg-gray-300"
              }`}>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.profileViews
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={handleNotificationSave}
            className="bg-linear-to-r from-primary to-secondary text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">Security</h2>
        </div>

        <div className="space-y-6">
          {/* Password Change */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Change Password
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={passwordChange.currentPassword}
                  onChange={(e) =>
                    setPasswordChange({
                      ...passwordChange,
                      currentPassword: e.target.value,
                    })
                  }
                  className="border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  value={passwordChange.newPassword}
                  onChange={(e) =>
                    setPasswordChange({
                      ...passwordChange,
                      newPassword: e.target.value,
                    })
                  }
                  className="border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={passwordChange.confirmPassword}
                  onChange={(e) =>
                    setPasswordChange({
                      ...passwordChange,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="border-border"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={handlePasswordChange}
                className="bg-linear-to-r from-primary to-secondary text-white">
                <Save className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() =>
                  setSecuritySettings({
                    ...securitySettings,
                    twoFactorEnabled: !securitySettings.twoFactorEnabled,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securitySettings.twoFactorEnabled
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    securitySettings.twoFactorEnabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Last Password Change */}
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Last password change: {securitySettings.lastPasswordChange}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <h2 className="text-xl font-bold text-red-700 mb-4">Danger Zone</h2>
        <p className="text-red-600 mb-4">
          Deleting your account is permanent and cannot be undone. All your data
          will be lost.
        </p>
        <Button
          variant="outline"
          className="border-red-200 text-red-700 hover:bg-red-50">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
