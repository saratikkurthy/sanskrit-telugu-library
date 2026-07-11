"use server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

export async function triggerScan() {
  try {
    // We are using init_and_populate.py based on your directory listing
    const scriptPath = path.join(process.cwd(), "init_and_populate.py");
    
    console.log(`Executing: python ${scriptPath}`);
    
    // Execute the script
    const { stdout, stderr } = await execAsync(`python "${scriptPath}"`);
    
    console.log("Scan output:", stdout);
    return { success: true, message: "Scan and population complete!" };
  } catch (error) {
    console.error("Scan failed:", error);
    return { success: false, message: "Scan failed. Check terminal logs." };
  }
}