
import { Skill } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";

interface SkillBadgeProps {
  skill: Skill;
}

export function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <div className="bg-white border rounded-md p-3 relative">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{skill.name}</h4>
        <div className="flex items-center text-xs text-gray-500">
          <Award className="w-3 h-3 mr-1 text-yellow-500" />
          <span>{skill.endorsements}</span>
        </div>
      </div>
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
          <span>Proficiency</span>
          <span>{skill.level}/5</span>
        </div>
        <Progress value={(skill.level / 5) * 100} className="h-1.5" />
      </div>
    </div>
  );
}
