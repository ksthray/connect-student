"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Briefcase,
  BookOpen,
  Award,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Save,
} from "lucide-react";

interface Experience {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrently: boolean;
  description: string;
}

interface Education {
  id: number;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  id: number;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export default function CandidateProfile() {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Sarah",
    lastName: "Chen",
    email: "sarah.chen@email.com",
    phone: "+1-555-0101",
    location: "San Francisco, CA",
    bio: "Passionate about technology and innovation. Experienced full-stack developer with a focus on modern web technologies.",
    profilePhoto: "sarah_profile.jpg",
  });

  const [resume, setResume] = useState({
    fileName: "CV_Sarah_Chen_2024.pdf",
    uploadedDate: "Jan 15, 2024",
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: 1,
      jobTitle: "Full Stack Developer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "Present",
      isCurrently: true,
      description:
        "Develop and maintain web applications using React and Node.js.",
    },
    {
      id: 2,
      jobTitle: "Junior Developer",
      company: "StartUp Solutions",
      location: "Remote",
      startDate: "Jun 2020",
      endDate: "Dec 2021",
      isCurrently: false,
      description: "Built responsive web interfaces and integrated APIs.",
    },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: 1,
      school: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2016",
      endDate: "2020",
      description: "GPA: 3.8/4.0",
    },
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: "React", level: "advanced" },
    { id: 2, name: "TypeScript", level: "advanced" },
    { id: 3, name: "Node.js", level: "intermediate" },
    { id: 4, name: "SQL", level: "intermediate" },
    { id: 5, name: "Python", level: "beginner" },
  ]);

  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(
    null
  );
  const [editingEducationId, setEditingEducationId] = useState<number | null>(
    null
  );
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);

  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrently: false,
    description: "",
  });

  const [newEducation, setNewEducation] = useState<Partial<Education>>({
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "intermediate" as const,
  } as any);

  const [saveMessage, setSaveMessage] = useState("");

  const handlePersonalInfoSave = () => {
    setSaveMessage("Personal information updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleAddExperience = () => {
    if (!newExperience.jobTitle || !newExperience.company) {
      setSaveMessage("Please fill in required fields");
      return;
    }

    if (editingExperienceId) {
      setExperiences(
        experiences.map((exp) =>
          exp.id === editingExperienceId
            ? { ...exp, ...newExperience, id: exp.id }
            : exp
        ) as Experience[]
      );
      setEditingExperienceId(null);
    } else {
      const experience: Experience = {
        id: Math.max(...experiences.map((e) => e.id), 0) + 1,
        jobTitle: newExperience.jobTitle || "",
        company: newExperience.company || "",
        location: newExperience.location || "",
        startDate: newExperience.startDate || "",
        endDate: newExperience.endDate || "",
        isCurrently: newExperience.isCurrently || false,
        description: newExperience.description || "",
      };
      setExperiences([...experiences, experience]);
    }

    setNewExperience({
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrently: false,
      description: "",
    });
    setSaveMessage("Experience saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleAddEducation = () => {
    if (!newEducation.school || !newEducation.degree) {
      setSaveMessage("Please fill in required fields");
      return;
    }

    if (editingEducationId) {
      setEducations(
        educations.map((edu) =>
          edu.id === editingEducationId
            ? { ...edu, ...newEducation, id: edu.id }
            : edu
        ) as Education[]
      );
      setEditingEducationId(null);
    } else {
      const education: Education = {
        id: Math.max(...educations.map((e) => e.id), 0) + 1,
        school: newEducation.school || "",
        degree: newEducation.degree || "",
        field: newEducation.field || "",
        startDate: newEducation.startDate || "",
        endDate: newEducation.endDate || "",
        description: newEducation.description || "",
      };
      setEducations([...educations, education]);
    }

    setNewEducation({
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setSaveMessage("Education saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleAddSkill = () => {
    if (!newSkill.name) {
      setSaveMessage("Please enter a skill name");
      return;
    }

    if (editingSkillId) {
      setSkills(
        skills.map((skill) =>
          skill.id === editingSkillId
            ? { ...skill, name: newSkill.name, level: newSkill.level }
            : skill
        )
      );
      setEditingSkillId(null);
    } else {
      const skill: Skill = {
        id: Math.max(...skills.map((s) => s.id), 0) + 1,
        name: newSkill.name,
        level: newSkill.level,
      };
      setSkills([...skills, skill]);
    }

    setNewSkill({ name: "", level: "intermediate" });
    setSaveMessage("Skill added successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const deleteExperience = (id: number) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const deleteEducation = (id: number) => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  const deleteSkill = (id: number) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  return (
    <div className="space-y-8 p-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Create and manage your professional profile to attract opportunities.
        </p>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          {saveMessage}
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">
            Personal Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              First Name
            </label>
            <Input
              value={personalInfo.firstName}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, firstName: e.target.value })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Last Name
            </label>
            <Input
              value={personalInfo.lastName}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, lastName: e.target.value })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <Input
              value={personalInfo.email}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, email: e.target.value })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone
            </label>
            <Input
              value={personalInfo.phone}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, phone: e.target.value })
              }
              className="border-border"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <Input
              value={personalInfo.location}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, location: e.target.value })
              }
              className="border-border"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio
            </label>
            <textarea
              value={personalInfo.bio}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, bio: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 font-sans"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            onClick={handlePersonalInfoSave}
            className="bg-linear-to-r from-primary to-secondary text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Resume Upload */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">Resume / CV</h2>
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground mb-1">Upload your resume</p>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your PDF or DOC file here, or click to browse
          </p>
          <Button variant="outline" className="border-border">
            Choose File
          </Button>
        </div>

        {resume.fileName && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{resume.fileName}</p>
              <p className="text-sm text-muted-foreground">
                Uploaded on {resume.uploadedDate}
              </p>
            </div>
            <Button variant="outline" className="border-red-200 text-red-600">
              Remove
            </Button>
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-foreground" />
            <h2 className="text-xl font-bold text-foreground">Experience</h2>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditingExperienceId(null);
              setNewExperience({
                jobTitle: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                isCurrently: false,
                description: "",
              });
            }}
            className="bg-linear-to-r from-primary to-secondary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>

        {/* Add/Edit Experience Form */}
        <div className="mb-6 p-4 border border-border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-foreground mb-4">
            {editingExperienceId ? "Edit Experience" : "New Experience"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Job Title"
              value={newExperience.jobTitle || ""}
              onChange={(e) =>
                setNewExperience({ ...newExperience, jobTitle: e.target.value })
              }
              className="border-border"
            />
            <Input
              placeholder="Company"
              value={newExperience.company || ""}
              onChange={(e) =>
                setNewExperience({ ...newExperience, company: e.target.value })
              }
              className="border-border"
            />
            <Input
              placeholder="Location"
              value={newExperience.location || ""}
              onChange={(e) =>
                setNewExperience({ ...newExperience, location: e.target.value })
              }
              className="border-border"
            />
            <Input
              placeholder="Start Date"
              value={newExperience.startDate || ""}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  startDate: e.target.value,
                })
              }
              className="border-border"
            />
            {!newExperience.isCurrently && (
              <Input
                placeholder="End Date"
                value={newExperience.endDate || ""}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    endDate: e.target.value,
                  })
                }
                className="border-border"
              />
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newExperience.isCurrently || false}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    isCurrently: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <label className="text-sm text-foreground">
                I currently work here
              </label>
            </div>
          </div>
          <textarea
            placeholder="Description"
            value={newExperience.description || ""}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                description: e.target.value,
              })
            }
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 font-sans mb-4"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAddExperience}
              className="bg-linear-to-r from-primary to-secondary text-white">
              Save Experience
            </Button>
            {editingExperienceId && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingExperienceId(null);
                  setNewExperience({
                    jobTitle: "",
                    company: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    isCurrently: false,
                    description: "",
                  });
                }}
                className="border-border">
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Experience List */}
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {exp.jobTitle}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {exp.company} • {exp.location}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {exp.startDate} –{" "}
                    {exp.isCurrently ? "Present" : exp.endDate}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-foreground mt-2">
                      {exp.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingExperienceId(exp.id);
                      setNewExperience(exp);
                    }}
                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteExperience(exp.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-foreground" />
            <h2 className="text-xl font-bold text-foreground">Education</h2>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditingEducationId(null);
              setNewEducation({
                school: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                description: "",
              });
            }}
            className="bg-linear-to-r from-primary to-secondary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>

        {/* Add/Edit Education Form */}
        <div className="mb-6 p-4 border border-border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-foreground mb-4">
            {editingEducationId ? "Edit Education" : "New Education"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="School/University"
              value={newEducation.school || ""}
              onChange={(e) =>
                setNewEducation({ ...newEducation, school: e.target.value })
              }
              className="border-border"
            />
            <Input
              placeholder="Degree"
              value={newEducation.degree || ""}
              onChange={(e) =>
                setNewEducation({ ...newEducation, degree: e.target.value })
              }
              className="border-border"
            />
            <Input
              placeholder="Field of Study"
              value={newEducation.field || ""}
              onChange={(e) =>
                setNewEducation({ ...newEducation, field: e.target.value })
              }
              className="border-border"
            />
            <Input
              placeholder="Start Year"
              value={newEducation.startDate || ""}
              onChange={(e) =>
                setNewEducation({ ...newEducation, startDate: e.target.value })
              }
              className="border-border"
            />
            <Input
              placeholder="End Year"
              value={newEducation.endDate || ""}
              onChange={(e) =>
                setNewEducation({ ...newEducation, endDate: e.target.value })
              }
              className="border-border"
            />
          </div>
          <textarea
            placeholder="Description (GPA, honors, etc.)"
            value={newEducation.description || ""}
            onChange={(e) =>
              setNewEducation({ ...newEducation, description: e.target.value })
            }
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 font-sans mb-4"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAddEducation}
              className="bg-linear-to-r from-primary to-secondary text-white">
              Save Education
            </Button>
            {editingEducationId && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingEducationId(null);
                  setNewEducation({
                    school: "",
                    degree: "",
                    field: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  });
                }}
                className="border-border">
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Education List */}
        <div className="space-y-3">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{edu.school}</p>
                  <p className="text-sm text-muted-foreground">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {edu.startDate} – {edu.endDate}
                  </p>
                  {edu.description && (
                    <p className="text-sm text-foreground mt-2">
                      {edu.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingEducationId(edu.id);
                      setNewEducation(edu);
                    }}
                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteEducation(edu.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-foreground" />
            <h2 className="text-xl font-bold text-foreground">Skills</h2>
          </div>
        </div>

        {/* Add Skill Form */}
        <div className="mb-6 p-4 border border-border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-foreground mb-4">
            {editingSkillId ? "Edit Skill" : "Add New Skill"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Skill name"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
              className="border-border"
            />
            <select
              value={newSkill.level}
              onChange={(e) =>
                setNewSkill({ ...newSkill, level: e.target.value as any })
              }
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 bg-white">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAddSkill}
              className="bg-linear-to-r from-primary to-secondary text-white">
              Save Skill
            </Button>
            {editingSkillId && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingSkillId(null);
                  setNewSkill({ name: "", level: "intermediate" });
                }}
                className="border-border">
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Skills List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-foreground">{skill.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {skill.level}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingSkillId(skill.id);
                    setNewSkill({ name: skill.name, level: skill.level });
                  }}
                  className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
