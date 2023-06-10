/* eslint-disable no-use-before-define */
import JiraApi from "jira-client";

export default interface JiraWebhook {
  timestamp: number;
  webhookEvent: string;
  issue_event_type_name: string;
  user: JiraApi.UserObject;
  issue: JiraApi.IssueObject;
  changelog: JiraChangelog;
}

interface JiraChangelog {
  id: string;
  items: JiraChangelogItem[];
}

interface JiraChangelogItem {
  field: string;
  fieldtype: string;
  fieldId: string;
  fromString: string;
  toString: string;
}
