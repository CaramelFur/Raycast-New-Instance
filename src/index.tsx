import { Action, ActionPanel, getApplications, Icon, List, showToast, Toast, Application, closeMainWindow } from '@raycast/api';
import { usePromise } from '@raycast/utils';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default function Command() {
  const { data: applications, isLoading, error } = usePromise(getApplications);

  const filteredApplications = applications || [];

  async function launchNewInstance(application: Application) {
    try {
      await showToast({
        style: Toast.Style.Animated,
        title: `Launching new instance of ${application.name}...`,
      });

      // Use shell to execute open -n command for new instance
      await execAsync(`open -n "${application.path}"`);

      await showToast({
        style: Toast.Style.Success,
        title: `Launched new instance of ${application.name}`,
      });

      await closeMainWindow();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to launch application',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  if (error) {
    return (
      <List>
        <List.EmptyView icon={Icon.ExclamationMark} title="Failed to load applications" description="Unable to retrieve the list of installed applications" />
      </List>
    );
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search applications..." throttle>
      {filteredApplications.length === 0 && !isLoading ? (
        <List.EmptyView icon={Icon.AppWindow} title="No applications found" description="No suitable applications found for launching new instances" />
      ) : (
        filteredApplications.map((app) => (
          <List.Item
            key={app.path}
            title={app.name}
            subtitle={app.path}
            icon={{ fileIcon: app.path }}
            accessories={[
              {
                text: app.bundleId || '',
                tooltip: 'Bundle ID',
              },
            ]}
            actions={
              <ActionPanel>
                <Action title="Launch New Instance" icon={Icon.Plus} onAction={() => launchNewInstance(app)} />
                <Action.ShowInFinder title="Show in Finder" path={app.path} />
                <Action.CopyToClipboard title="Copy Application Path" content={app.path} shortcut={{ modifiers: ['cmd'], key: 'c' }} />
                <Action.CopyToClipboard title="Copy Bundle ID" content={app.bundleId || ''} shortcut={{ modifiers: ['cmd', 'shift'], key: 'c' }} />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
