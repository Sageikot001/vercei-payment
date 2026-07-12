export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'basic' | 'standard' | 'premium';
          billing_period: '6-months' | '12-months' | '24-months';
          status: 'active' | 'cancelled' | 'expired' | 'pending';
          paystack_reference: string | null;
          paystack_customer_code: string | null;
          amount_paid: number;
          currency: string;
          starts_at: string;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: 'basic' | 'standard' | 'premium';
          billing_period: '6-months' | '12-months' | '24-months';
          status?: 'active' | 'cancelled' | 'expired' | 'pending';
          paystack_reference?: string | null;
          paystack_customer_code?: string | null;
          amount_paid: number;
          currency: string;
          starts_at?: string;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          plan?: 'basic' | 'standard' | 'premium';
          billing_period?: '6-months' | '12-months' | '24-months';
          status?: 'active' | 'cancelled' | 'expired' | 'pending';
          paystack_reference?: string | null;
          paystack_customer_code?: string | null;
          expires_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          framework: string;
          git_url: string | null;
          git_branch: string;
          build_command: string;
          output_directory: string;
          install_command: string;
          node_version: string;
          root_directory: string;
          status: 'active' | 'paused' | 'deleted';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          framework?: string;
          git_url?: string | null;
          git_branch?: string;
          build_command?: string;
          output_directory?: string;
          install_command?: string;
          node_version?: string;
          root_directory?: string;
          status?: 'active' | 'paused' | 'deleted';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          framework?: string;
          git_url?: string | null;
          git_branch?: string;
          build_command?: string;
          output_directory?: string;
          install_command?: string;
          node_version?: string;
          root_directory?: string;
          status?: 'active' | 'paused' | 'deleted';
          updated_at?: string;
        };
      };
      deployments: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          commit_hash: string | null;
          commit_message: string | null;
          branch: string;
          status: 'queued' | 'building' | 'ready' | 'error' | 'cancelled';
          type: 'production' | 'preview';
          url: string | null;
          build_duration: number | null;
          logs: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          commit_hash?: string | null;
          commit_message?: string | null;
          branch?: string;
          status?: 'queued' | 'building' | 'ready' | 'error' | 'cancelled';
          type?: 'production' | 'preview';
          url?: string | null;
          build_duration?: number | null;
          logs?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          commit_hash?: string | null;
          commit_message?: string | null;
          branch?: string;
          status?: 'queued' | 'building' | 'ready' | 'error' | 'cancelled';
          type?: 'production' | 'preview';
          url?: string | null;
          build_duration?: number | null;
          logs?: string | null;
          updated_at?: string;
        };
      };
      domains: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          domain: string;
          is_primary: boolean;
          verified: boolean;
          ssl_status: 'pending' | 'active' | 'error';
          verification_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          domain: string;
          is_primary?: boolean;
          verified?: boolean;
          ssl_status?: 'pending' | 'active' | 'error';
          verification_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          domain?: string;
          is_primary?: boolean;
          verified?: boolean;
          ssl_status?: 'pending' | 'active' | 'error';
          verification_token?: string | null;
          updated_at?: string;
        };
      };
      environment_variables: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          key: string;
          value: string;
          environment: 'production' | 'preview' | 'development' | 'all';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          key: string;
          value: string;
          environment?: 'production' | 'preview' | 'development' | 'all';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string;
          environment?: 'production' | 'preview' | 'development' | 'all';
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Deployment = Database['public']['Tables']['deployments']['Row'];
export type Domain = Database['public']['Tables']['domains']['Row'];
export type EnvironmentVariable = Database['public']['Tables']['environment_variables']['Row'];
