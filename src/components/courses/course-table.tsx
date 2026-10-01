import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteButton } from "@/components/confirm-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";

const programLabels = {
  CPE: "CPE — วิศวกรรมคอมพิวเตอร์",
  ISNE: "ISNE — วิศวกรรมระบบสารสนเทศและเครือข่าย",
};

const semesterLabels = {
  "1": "ภาคการศึกษาที่ 1",
  "2": "ภาคการศึกษาที่ 2",
  "3": "ภาคฤดูร้อน",
};

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead>หลักสูตร</TableHead>
            <TableHead>ภาคการศึกษา</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead>รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีวิชาที่เปิดสอน
              </TableCell>
            </TableRow>
          )}

          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell>{course.courseId}</TableCell>
              <TableCell className="min-w-48">{course.courseTitle}</TableCell>
              <TableCell>
                <Badge variant="outline">{programLabels[course.program]}</Badge>
              </TableCell>
              <TableCell>{semesterLabels[course.semester]}</TableCell>
              <TableCell className="min-w-48">
                {course.description || (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="min-w-56">
                <div className="flex flex-col gap-1 text-sm">
                  {course.instructors.map((instructor) => (
                    <div key={instructor.email}>
                      <div>{instructor.name}</div>
                      <div className="text-muted-foreground">
                        {instructor.email}
                      </div>
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={course.notifyByEmail ? "default" : "secondary"}>
                  {course.notifyByEmail ? "รับ" : "ไม่รับ"}
                </Badge>
              </TableCell>
              <TableCell>
                <ConfirmDeleteButton
                  label={`ลบวิชา ${course.courseId}`}
                  title="ลบวิชา?"
                  description={`ลบ ${course.courseId} — ${course.courseTitle} ออกจากรายวิชาที่เปิดสอน พร้อมการลงทะเบียนทั้งหมดของวิชานี้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
