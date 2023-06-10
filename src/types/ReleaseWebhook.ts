export default interface ReleaseWebhook {
  succeeded: boolean;
  repository: string;
  version?: string;
  runId: string;
}
