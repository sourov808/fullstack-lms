"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil, Video, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Lesson {
  id: string;
  title: string;
  position: number;
  is_free: boolean;
  video_url: string | null;
  content: string | null;
}

interface LessonListProps {
  items: Lesson[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const LessonList = ({
  items,
  onReorder,
  onEdit,
}: LessonListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [lessons, setLessons] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setLessons(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const itemsContent = Array.from(lessons);
    const [reorderedItem] = itemsContent.splice(result.source.index, 1);
    itemsContent.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedLessons = itemsContent.slice(startIndex, endIndex + 1);

    setLessons(itemsContent);

    const bulkUpdateData = updatedLessons.map((lesson) => ({
      id: lesson.id,
      position: itemsContent.findIndex((item) => item.id === lesson.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lessons">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {lessons.map((lesson, index) => (
              <Draggable
                key={lesson.id}
                draggableId={lesson.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={`flex items-center gap-x-2 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-blue-900/50 border text-slate-700 dark:text-slate-300 rounded-md mb-4 text-sm`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={`px-3 py-3 border-r border-r-slate-200 dark:border-r-blue-900/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-l-md transition ${
                        lesson.is_free ? "bg-slate-100 dark:bg-slate-900" : ""
                      }`}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {lesson.title}
                    <div className="ml-auto pr-3 flex items-center gap-x-2">
                      {lesson.is_free && (
                        <Badge className="bg-green-600/10 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-600/20 dark:hover:bg-green-900/30 text-xs shadow-none cursor-default">
                          Free Preview
                        </Badge>
                      )}
                      
                      {lesson.video_url && (
                        <Badge variant="outline" className="gap-1 bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 shadow-none">
                          <Video className="w-3 h-3" />
                          Video
                        </Badge>
                      )}

                      {!lesson.video_url && lesson.content && (
                        <Badge variant="outline" className="gap-1 bg-amber-50/50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 shadow-none">
                          <FileText className="w-3 h-3" />
                          Text
                        </Badge>
                      )}

                      <Pencil
                        onClick={() => onEdit(lesson.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition text-slate-500 dark:text-slate-400 ml-2"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
