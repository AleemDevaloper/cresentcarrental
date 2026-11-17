import {
  faSignInAlt,
  faCalendarXmark,
  faCommentDots,
  faStar,
  faBuildingColumns,
  faUsers,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';

export const ACTIVITY_TYPE_CONFIG = {
  checked_in: {
    color: 'primary',
    icon: faSignInAlt,
    label: 'Checked In',
    category: 'attendance',
  },
  leave_request: {
    color: 'warning',
    icon: faCalendarXmark,
    label: 'Leave Request Submitted',
    category: 'leave',
  },
  feedback_received: {
    color: 'success',
    icon: faCommentDots,
    label: 'Feedback Received',
    category: 'performance',
  },
  performance_review: {
    color: 'info',
    icon: faStar,
    label: 'Performance Review Submitted',
    category: 'performance',
  },
  bank_details: {
    color: 'danger',
    icon: faBuildingColumns,
    label: 'Bank Details Updated',
    category: 'payroll',
  },
  team_change: {
    color: 'primary',
    icon: faUsers,
    label: 'Team Change Notified',
    category: 'organization',
  },
  reimbursement: {
    color: 'secondary',
    icon: faReceipt,
    label: 'Reimbursement Approved',
    category: 'finance',
  },
};

export const ACTIVITY_CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'leave', label: 'Leave' },
  { id: 'performance', label: 'Performance' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'organization', label: 'Organization' },
  { id: 'finance', label: 'Finance' },
];

export const SAMPLE_ACTIVITIES = [
  {
    id: 1,
    type: 'checked_in',
    title: 'Checked In',
    description: 'You successfully checked in today using the mobile app\'s biometric system.',
    timestamp: '2025-08-07T09:07:00',
    dateGroup: 'Today',
    status: 'completed',
    employee: { id: 1, name: 'You', role: 'Employee' },
    isNew: true,
  },
  {
    id: 2,
    type: 'leave_request',
    title: 'Leave Request Submitted',
    description: 'Casual Leave for Aug 9, 2025 — pending manager approval.',
    timestamp: '2025-08-07T15:14:00',
    dateGroup: 'Today',
    status: 'pending',
    employee: { id: 1, name: 'You', role: 'Employee' },
    isNew: false,
  },
  {
    id: 3,
    type: 'feedback_received',
    title: 'Feedback Received',
    description: 'Your team lead added feedback to your monthly check-in.',
    timestamp: '2025-08-06T18:55:00',
    dateGroup: 'Yesterday',
    status: 'completed',
    employee: { id: 2, name: 'Sarah Chen', role: 'Team Lead' },
    isNew: false,
  },
  {
    id: 4,
    type: 'performance_review',
    title: 'Performance Review Submitted',
    description: 'Q2 performance review has been submitted for HR review.',
    timestamp: '2025-08-06T17:25:00',
    dateGroup: 'Yesterday',
    status: 'in_review',
    employee: { id: 1, name: 'You', role: 'Employee' },
    isNew: false,
  },
  {
    id: 5,
    type: 'bank_details',
    title: 'Bank Details Updated',
    description: 'Your bank account information was updated successfully.',
    timestamp: '2025-08-06T16:23:00',
    dateGroup: 'Yesterday',
    status: 'completed',
    employee: { id: 1, name: 'You', role: 'Employee' },
    isNew: false,
  },
  {
    id: 6,
    type: 'team_change',
    title: 'Team Change Notified',
    description: 'You have been reassigned to the Product Engineering team.',
    timestamp: '2025-08-03T16:23:00',
    dateGroup: 'Aug 3, 2025',
    status: 'completed',
    employee: { id: 3, name: 'HR Admin', role: 'HR Manager' },
    isNew: false,
  },
  {
    id: 7,
    type: 'feedback_received',
    title: 'Feedback Received',
    description: 'Peer feedback received from your sprint retrospective session.',
    timestamp: '2025-08-03T18:28:00',
    dateGroup: 'Aug 3, 2025',
    status: 'completed',
    employee: { id: 4, name: 'Alex Rivera', role: 'Peer' },
    isNew: false,
  },
  {
    id: 8,
    type: 'reimbursement',
    title: 'Reimbursement Approved',
    description: 'Your travel expense reimbursement was approved.',
    timestamp: '2025-08-03T16:50:00',
    dateGroup: 'Aug 3, 2025',
    status: 'approved',
    employee: { id: 5, name: 'Finance Team', role: 'Finance' },
    isNew: false,
  },
];

export const EXTRA_ACTIVITIES = [
  {
    id: 9,
    type: 'checked_in',
    title: 'Checked In',
    description: 'Checked in via web portal at office location.',
    timestamp: '2025-08-02T08:45:00',
    dateGroup: 'Aug 2, 2025',
    status: 'completed',
    employee: { id: 1, name: 'You', role: 'Employee' },
    isNew: false,
  },
  {
    id: 10,
    type: 'leave_request',
    title: 'Leave Request Submitted',
    description: 'Sick leave for Aug 1, 2025 — approved by manager.',
    timestamp: '2025-08-01T10:30:00',
    dateGroup: 'Aug 1, 2025',
    status: 'approved',
    employee: { id: 1, name: 'You', role: 'Employee' },
    isNew: false,
  },
];

export const STATUS_CONFIG = {
  completed: { label: 'Completed', badge: 'success' },
  pending: { label: 'Pending', badge: 'warning' },
  in_review: { label: 'In Review', badge: 'info' },
  approved: { label: 'Approved', badge: 'primary' },
};

export const formatActivityDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).replace(',', ' at');
};

export const groupActivitiesByDate = (activities) => {
  const groups = {};
  activities.forEach((activity) => {
    const key = activity.dateGroup;
    if (!groups[key]) groups[key] = [];
    groups[key].push(activity);
  });
  return Object.entries(groups).map(([date, items]) => ({ date, items }));
};
