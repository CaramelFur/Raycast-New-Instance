import { getFrontmostApplication } from '@raycast/api';
import { launchNewInstance, showFailureToast } from './utils';

export default async function Command() {
  try {
    // Get the currently active application
    const frontmostApp = await getFrontmostApplication();
    
    // Launch new instance using shared utility
    await launchNewInstance(frontmostApp);
  } catch (error) {
    await showFailureToast(
      'Failed to launch new instance',
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
} 