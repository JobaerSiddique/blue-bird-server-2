 // Replace with the actual path to your Teacher model

import { Teacher } from "./teacher.model";

export async function generateTeacherId(year: string) {
    console.log("year",year);
  try {
    // Step 1: Format the year (last 2 digits)
    const yearSuffix = year.slice(-2);

    // Step 2: Define the fixed teacher code
    const teacherCode = "55";

    // Step 3: Find the last teacher ID for the same year
    const lastTeacher = await Teacher.findOne(
      { teacherId: { $regex: `^${yearSuffix}${teacherCode}` } }, // Match IDs starting with YY55
      { teacherId: 1 } // Project only the teacherId field
    )
      .sort({ teacherId: -1 }) // Sort by teacherId in descending order
      .lean();

    // Step 4: Determine the last 3 digits for the new teacher
    let lastThreeDigits = 1; // Default to 001 if no teachers exist
    if (lastTeacher && lastTeacher.teacherId) {
      const lastId = parseInt(lastTeacher.teacherId.slice(-3), 10); // Extract the last 3 digits
      if (!isNaN(lastId)) {
        lastThreeDigits = lastId + 1; // Increment the last ID
      }
    }

    // Step 5: Ensure the last 3 digits are 3 digits long (padded with leading zeros if necessary)
    const lastThreeDigitsFormatted = lastThreeDigits.toString().padStart(3, "0");

    // Step 6: Generate the new teacher ID
    const newTeacherId = `${yearSuffix}${teacherCode}${lastThreeDigitsFormatted}`;

    return newTeacherId;
  } catch (error) {
    console.error("Error generating teacher ID:", error);
    throw error;
  }
}
