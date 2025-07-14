import { showToast, Toast, closeMainWindow, getFrontmostApplication } from '@raycast/api';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function Command() {
  try {
    // Get the currently active application
    const frontmostApp = await getFrontmostApplication();
    
    await showToast({
      style: Toast.Style.Animated,
      title: `Launching new instance of ${frontmostApp.name}...`,
    });

    // Use shell to execute open -n command for new instance
    await execAsync(`open -n "${frontmostApp.path}"`);

    await showToast({
      style: Toast.Style.Success,
      title: `Launched new instance of ${frontmostApp.name}`,
    });

    await closeMainWindow();
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: 'Failed to launch new instance',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
} 