// import { Class } from "../class/class.model";
// import { Student } from "./student.model";


// export async function generateStudentId(admissionYear:string,classId:string ) {
//   console.log(classId);
//   try {
//     // Step 1: Fetch the class data by ID
//     const classData = await Class.findById(classId).lean();

//     if (!classData) {
//       throw new Error("Class not found.");
//     }

//     const { name, section, group } = classData;
//     const groupName = group || classData.group; // Use the passed group or the class group

//     // Step 2: Extract necessary data from class and section
//     const className = name.split(" ")[1]; // Assuming class name is in the format "Class 5"
//     const sectionLetter = section; // e.g., "A", "B", "C"

//     // Step 3: Format admission year (last two digits)
//     const yearSuffix = admissionYear.toString().slice(-2);

//     // Step 4: Generate a unique key for group, section, and class combination
//     const uniqueKey = `${className}${sectionLetter}${groupName}`;

//     // Step 5: Find the last student ID for the same class, section, group, and year
//     const lastStudent = await Student.findOne(
//       {
//         class: classId,
//         admissionYear: admissionYear,
//         group: groupName, // Also check the group
//       },
//       { studentId: 1 } // Project only the studentId field
//     )
//       .sort({ studentId: -1 }) // Sort by studentId in descending order
//       .lean();

//     // Step 6: Determine the last 3 digits for the new student
//     let lastThreeDigits = 1; // Default to 001 if no students exist
//     if (lastStudent && lastStudent.studentId) {
//       const lastId = parseInt(lastStudent.studentId.slice(-3), 10);
//       if (!isNaN(lastId)) {
//         lastThreeDigits = lastId + 1;
//       }
//     }

//     // Step 7: Ensure the last 3 digits are 3 digits long (padded with leading zeros if necessary)
//     const lastThreeDigitsFormatted = lastThreeDigits.toString().padStart(3, "0");

//     // Step 8: Generate the new student ID
//     let newStudentId = `${yearSuffix}${className}${sectionLetter}${lastThreeDigitsFormatted}`;

//     // Step 9: Check if the generated studentId already exists
//     let studentExists = await Student.exists({ studentId: newStudentId });
//     let attempts = 0;
    
//     // If studentId exists, increment the number and try again
//     while (studentExists && attempts < 10) {
//       lastThreeDigits++;
//       const lastThreeDigitsFormatted = lastThreeDigits.toString().padStart(3, "0");
//       newStudentId = `${yearSuffix}${className}${sectionLetter}${lastThreeDigitsFormatted}`;
//       studentExists = await Student.exists({ studentId: newStudentId });
//       attempts++;
//     }

//     if (studentExists) {
//       throw new Error("Unable to generate a unique student ID after several attempts.");
//     }

//     return newStudentId;
//   } catch (error) {
//     console.error("Error generating student ID:", error);
//     throw error;
//   }
// }
import { Class } from "../class/class.model";
import { Student } from "./student.model";

export async function generateStudentId(admissionYear: string, classId: string) {
  console.log(`Generating Student ID for Class ID: ${classId}`);

  try {
    // Step 1: Fetch the class data by ID
    const classData = await Class.findById(classId).lean();

    if (!classData) {
      throw new Error("Class not found.");
    }

    console.log("Class Data:", classData);

    const { name, section, group } = classData;
    const groupName = group || ""; // Use the passed group or the class group
    const sectionLetter = section || ""; // e.g., "A", "B", "C"

    // Step 2: Define specific codes for "Play" and "Nursery"
    const classCodes: Record<string, string> = {
      Play: "22",
      Nursery: "33",
    };

    // Step 3: Normalize the class name
    const normalizedClassName = name.replace("class", "").trim(); // Remove "class" prefix if present
    console.log(`Normalized Class Name: ${normalizedClassName}`);

    // Step 4: Determine the class code
    let classCode = classCodes[normalizedClassName]; // Check if "Play" or "Nursery"

    if (!classCode) {
      // For other class names, extract numbers from the name (e.g., "Class 5")
      const extractedNumbers = normalizedClassName.replace(/\D+/g, "");
      if (extractedNumbers) {
        classCode = extractedNumbers;
      } else {
        throw new Error("Invalid class name format.");
      }
    }

    console.log(`Class Code: ${classCode}`);

    // Step 5: Format admission year (last two digits)
    const yearSuffix = admissionYear.toString().slice(-2);

    // Step 6: Find the last student ID for the same class, section, and year
    const lastStudent = await Student.findOne(
      {
        class: classId,
        admissionYear: admissionYear,
        group: groupName, // Also check the group
      },
      { studentId: 1 } // Project only the studentId field
    )
      .sort({ studentId: -1 }) // Sort by studentId in descending order
      .lean();

    // Step 7: Determine the last 3 digits for the new student
    let lastThreeDigits = 1; // Default to 001 if no students exist
    if (lastStudent && lastStudent.studentId) {
      const lastId = parseInt(lastStudent.studentId.slice(-3), 10);
      if (!isNaN(lastId)) {
        lastThreeDigits = lastId + 1;
      }
    }

    // Step 8: Ensure the last 3 digits are 3 digits long (padded with leading zeros if necessary)
    const lastThreeDigitsFormatted = lastThreeDigits.toString().padStart(3, "0");

    // Step 9: Generate the new student ID
    let newStudentId = `${yearSuffix}${classCode}${sectionLetter}${lastThreeDigitsFormatted}`;

    // Step 10: Check if the generated studentId already exists
    let studentExists = await Student.exists({ studentId: newStudentId });
    let attempts = 0;

    // If studentId exists, increment the number and try again
    while (studentExists && attempts < 10) {
      lastThreeDigits++;
      const lastThreeDigitsFormatted = lastThreeDigits.toString().padStart(3, "0");
      newStudentId = `${yearSuffix}${classCode}${sectionLetter}${lastThreeDigitsFormatted}`;
      studentExists = await Student.exists({ studentId: newStudentId });
      attempts++;
    }

    if (studentExists) {
      throw new Error("Unable to generate a unique student ID after several attempts.");
    }

    return newStudentId;
  } catch (error) {
    console.error("Error generating student ID:", error);
    throw error;
  }
}






