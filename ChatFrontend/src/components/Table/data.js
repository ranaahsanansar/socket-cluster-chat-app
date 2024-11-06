import React from 'react';
const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'NAME', uid: 'user_name', sortable: true },
  { name: 'Wallet Address', uid: 'wallet_address', sortable: false },
  { name: 'KYC Status', uid: 'kyc_status', sortable: false },
  { name: 'Total Staking', uid: 'total_stakings', sortable: true },
  { name: 'Staking Count', uid: 'stakings_count', sortable: true },
  { name: 'Created At', uid: 'created_at', sortable: false },

  //   { name: 'TEAM', uid: 'team', sortable: true },
  //   { name: 'EMAIL', uid: 'email', sortable: true },
  // {name: "STATUS", uid: "status", sortable: true},
  //   { name: 'ACTIONS', uid: 'actions' },
];

const allIdosColumns = [
  { name: 'ID', uid: 'id', sortable: false },
  { name: 'Listening', uid: 'listening', sortable: false },
  { name: 'Project Title', uid: 'project_title', sortable: false },
  { name: 'Project Description', uid: 'project_description', sortable: false },
  { name: 'Project Status', uid: 'project_status', sortable: false },
  { name: 'Token Name', uid: 'token_name', sortable: false },
  { name: 'Token Symbol', uid: 'token_symbol', sortable: false },
  { name: 'Launchpool Address', uid: 'launchpool_address', sortable: false },
  { name: 'Max Cap', uid: 'max_cap', sortable: false },
  { name: 'Start Date', uid: 'start_date', sortable: false },
  { name: 'End Date', uid: 'end_date', sortable: false },
  { name: 'Created At', uid: 'created_at', sortable: false },
  { name: 'Updated At', uid: 'updated_at', sortable: false },
  { name: 'Staking Address', uid: 'staking_address', sortable: false },
  { name: 'Token Address', uid: 'token_address', sortable: false },
  { name: 'Total Supply', uid: 'total_supply', sortable: false },
  { name: 'Tiers Count', uid: 'tiers_count', sortable: true },
  { name: 'Token Price', uid: 'token_price', sortable: true },
];

const statusOptions = [
  { name: 'Active', uid: 'active' },
  { name: 'Paused', uid: 'paused' },
  { name: 'Vacation', uid: 'vacation' },
];

export { columns, statusOptions, allIdosColumns };
