import React, { useState } from "react";

import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  DollarSign,
  MapPin,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceDocument as APISourceDocument } from "@/types/resource-allocation";

// Helper function to extract person name from content
const extractPersonName = (content: string): string => {
  if (!content) return "Unknown Person";

  // Look for "Personal Profile: Name" pattern
  const profileMatch = content.match(/Personal Profile:\s*(.+?)(?:\n|$)/i);
  if (profileMatch) {
    return profileMatch[1].trim();
  }

  // Fallback: look for name in demographics section
  const nameMatch = content.match(/(?:Name|Person):\s*(.+?)(?:\n|,|$)/i);
  if (nameMatch) {
    return nameMatch[1].trim();
  }

  return "Unknown Person";
};

// Helper function to format AI response text with proper paragraphs and structure
const formatResponseText = (text: string): React.ReactElement => {
  if (!text) return <p>No response available.</p>;

  // Split by double newlines for paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <div className="space-y-3">
      {paragraphs.map((paragraph, index) => {
        const trimmedParagraph = paragraph.trim();

        // Check if it's a numbered list item
        if (trimmedParagraph.match(/^\d+\.\s/)) {
          const [title, ...content] = trimmedParagraph.split("\n");
          return (
            <div key={index} className="space-y-2">
              <h4 className="font-semibold text-gray-900">{title}</h4>
              {content.length > 0 && (
                <div className="space-y-1 pl-4">
                  {content.map((line, lineIndex) => (
                    <p
                      key={lineIndex}
                      className="text-sm leading-relaxed text-gray-700"
                    >
                      {line.trim()}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        }

        // Check if it's a bulleted section
        if (
          trimmedParagraph.includes("- ") ||
          trimmedParagraph.includes("• ")
        ) {
          const lines = trimmedParagraph.split("\n");
          const title = lines[0];
          const bullets = lines
            .slice(1)
            .filter((line) => line.match(/^\s*[-•]/));

          return (
            <div key={index} className="space-y-2">
              {title && !title.match(/^\s*[-•]/) && (
                <h4 className="font-semibold text-gray-900">{title}</h4>
              )}
              <ul className="space-y-1 pl-4">
                {bullets.map((bullet, bulletIndex) => (
                  <li
                    key={bulletIndex}
                    className="text-sm leading-relaxed text-gray-700"
                  >
                    {bullet.replace(/^\s*[-•]\s*/, "")}
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={index} className="text-sm leading-relaxed text-gray-700">
            {trimmedParagraph}
          </p>
        );
      })}
    </div>
  );
};

interface PersonCardProps {
  document: APISourceDocument;
  onClick?: (document: APISourceDocument) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ document, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIncomeColor = (incomeLevel: string) => {
    switch (incomeLevel?.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800";
      case "upper-middle":
        return "bg-blue-100 text-blue-800";
      case "middle":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={() => onClick?.(document)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-sm">
                {document.person_name && document.person_name !== "Unknown"
                  ? document.person_name
                  : extractPersonName(document.content || "")}
              </CardTitle>
              <p className="text-xs text-gray-500">
                Age: {document.age || "N/A"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Briefcase className="h-3 w-3" />
            <span>{document.job_title || "N/A"}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>{document.location || "N/A"}</span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3 text-gray-600" />
            <Badge
              className={`text-xs ${getIncomeColor(document.income_level || "")}`}
            >
              {document.income_level || "N/A"}
            </Badge>
            {document.annual_income && (
              <span className="text-xs text-gray-500">
                {formatCurrency(Number(document.annual_income))}
              </span>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-2 border-t pt-3">
            <div className="text-xs">
              <p className="mb-1 font-medium text-gray-700">Profile Details:</p>
              <p className="leading-relaxed text-gray-600">
                {document.content
                  ? document.content.length > 200
                    ? `${document.content.substring(0, 200)}...`
                    : document.content
                  : "No additional details available."}
              </p>
            </div>

            {document.data_type && (
              <Badge variant="outline" className="text-xs">
                {document.data_type}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface InteractiveResponseProps {
  sourceDocuments?: APISourceDocument[];
  onPersonClick?: (document: APISourceDocument) => void;
  maxInitialDisplay?: number;
}

const InteractiveResponse: React.FC<InteractiveResponseProps> = ({
  sourceDocuments = [],
  onPersonClick,
  maxInitialDisplay = 3,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (!sourceDocuments || sourceDocuments.length === 0) {
    return null;
  }

  const displayedDocuments = showAll
    ? sourceDocuments
    : sourceDocuments.slice(0, maxInitialDisplay);

  const remainingCount = sourceDocuments.length - maxInitialDisplay;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-gray-700">
        Based on {sourceDocuments.length} profile
        {sourceDocuments.length !== 1 ? "s" : ""}:
      </p>

      <div className="space-y-2">
        {displayedDocuments.map((doc, i) => (
          <PersonCard key={i} document={doc} onClick={onPersonClick} />
        ))}
      </div>

      {remainingCount > 0 && !showAll && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(true)}
          className="w-full text-xs"
        >
          Show {remainingCount} more profile{remainingCount !== 1 ? "s" : ""}
        </Button>
      )}

      {showAll && sourceDocuments.length > maxInitialDisplay && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(false)}
          className="w-full text-xs"
        >
          Show less
        </Button>
      )}
    </div>
  );
};

export const useInteractiveResponse = () => {
  const [selectedPerson, setSelectedPerson] =
    useState<APISourceDocument | null>(null);

  const renderResponse = (
    sourceDocuments?: APISourceDocument[],
    onPersonClick?: (document: APISourceDocument) => void,
  ) => {
    return (
      <InteractiveResponse
        sourceDocuments={sourceDocuments}
        onPersonClick={onPersonClick || setSelectedPerson}
      />
    );
  };

  return {
    renderResponse,
    selectedPerson,
    setSelectedPerson,
    formatResponseText, // Export the text formatting function
  };
};

// Export the functions separately for use in other components
export { formatResponseText, extractPersonName };
