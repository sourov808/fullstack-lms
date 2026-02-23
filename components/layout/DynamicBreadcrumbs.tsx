"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DynamicBreadcrumbs() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on the absolute home page
  if (pathname === "/") return null;

  // Split paths into segments and remove empty strings
  const segments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 w-full sticky top-[64px] md:top-[73px] z-30">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {segments.length > 0 && <BreadcrumbSeparator />}
          
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const path = `/${segments.slice(0, index + 1).join("/")}`;
            
            // Format segment for display: "courseId" -> "Course ID", "new" -> "New"
            // For long UUIDs, we might truncate or replace them if preferred, 
            // but generically let's just title case them
            const formattedSegment = segment.length > 20 
              ? segment.substring(0, 8) + '...' 
              : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

            return (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-semibold text-slate-800">
                      {formattedSegment}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={path}>{formattedSegment}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
