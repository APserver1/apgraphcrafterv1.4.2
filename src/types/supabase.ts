export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          settings: any;
          data: any;
          last_modified: string;
          user_id: string;
        };
        Insert: {
          id: string;
          name: string;
          settings: any;
          data: any;
          last_modified: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          settings?: any;
          data?: any;
          last_modified?: string;
          user_id?: string;
        };
      };
    };
  };
}