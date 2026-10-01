import { z } from "zod";
import type { Course } from "@/lib/types";

export const MAX_INSTRUCTORS = 3;
export const DESCRIPTION_MAX = 100;

export const courseFormSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก"),
  courseTitle: z
    .string()
    .trim()
    .min(1, "กรอกชื่อวิชา")
    .max(100, "ชื่อวิชายาวได้ไม่เกิน 100 ตัวอักษร"),
  instructors: z
    .array(
      z.object({
        name: z.string().trim().min(1, "กรอกชื่อผู้สอน"),
        email: z
          .string()
          .trim()
          .email("อีเมลไม่ถูกต้อง")
          .refine((email) => email.toLowerCase().endsWith("@cmu.ac.th"), {
            message: "ต้องเป็นอีเมล @cmu.ac.th",
          }),
      }),
    )
    .min(1, "ต้องมีผู้สอนอย่างน้อย 1 คน")
    .max(MAX_INSTRUCTORS, `มีผู้สอนได้ไม่เกิน ${MAX_INSTRUCTORS} คน`)
    .refine(
      (items) => {
        const emails = items.map((item) => item.email.trim().toLowerCase());
        return new Set(emails).size === emails.length;
      },
      "อีเมลผู้สอนซ้ำกัน",
    ),
  program: z.enum(["CPE", "ISNE"], { message: "เลือกหลักสูตร" }),
  semester: z.enum(["1", "2", "3"], { message: "เลือกภาคการศึกษา" }),
  description: z
    .string()
    .max(DESCRIPTION_MAX, `รายละเอียดต้องยาวไม่เกิน ${DESCRIPTION_MAX} ตัวอักษร`),
  notifyByEmail: z.boolean(),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;

export function createCourseFormSchema(existingCourses: Course[]) {
  return courseFormSchema.refine(
    (data) =>
      !existingCourses.some(
        (course) => course.courseId.trim() === data.courseId.trim(),
      ),
    {
      message: "รหัสวิชานี้มีอยู่แล้ว",
      path: ["courseId"],
    },
  );
}
