import { Link } from "react-router-dom";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export default function Privacy() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
      
      {/* --- HEADER: Back Button & Theme Toggle --- */}
      <div className="flex items-center justify-between mb-10 border-b pb-6">
        <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-foreground">
          <Link to="/Login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="flex items-center gap-2 rounded-full border bg-card p-1 shadow-sm">
          <Button
            type="button"
            variant={theme === "light" ? "default" : "ghost"}
            size="sm"
            className="rounded-full w-8 h-8 p-0"
            onClick={() => setTheme("light")}
          >
            <Sun className="size-4" />
          </Button>
          <Button
            type="button"
            variant={theme === "dark" ? "default" : "ghost"}
            size="sm"
            className="rounded-full w-8 h-8 p-0"
            onClick={() => setTheme("dark")}
          >
            <Moon className="size-4" />
          </Button>
        </div>
      </div>
      {/* ----------------------------------------- */}

      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Privacy Policy
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground">
        Last updated: April 9, 2026
      </p>

      <p className="leading-7 [&:not(:first-child)]:mt-6">
        This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
      </p>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10">
        Interpretation and Definitions
      </h2>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8">
        Interpretation
      </h3>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
      </p>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10">
        Collecting and Using Your Personal Data
      </h2>
      
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8">
        Types of Data Collected
      </h3>
      
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
        Personal Data
      </h4>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
      </p>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>Email address</li>
        <li>First name and last name</li>
        <li>Usage Data</li>
      </ul>

      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
        Usage Data
      </h4>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Usage Data is collected automatically when using the Service. It may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
      </p>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10">
        Security of Your Personal Data
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
      </p>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10">
        Contact Me
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        If you have any questions about this Privacy Policy, You can contact me securely through the contact forms provided on the portfolio platform.
      </p>
    </div>
  );
}