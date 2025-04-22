export const base_url =
  process.env.BASE_URL ?? 'https://qyyqlnwqwgvzxnccnbgm.supabase.co/functions/v1';
export const supabase_anon_key =
  process.env.SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5eXFsbndxd2d2enhuY2NuYmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0Nzg1ODMsImV4cCI6MjAzMjA1NDU4M30.6oJWKKDPtxSjtWm2o_kyqyzNsQT9UBeRyApDGVMt-zg';
export const x_region = process.env.X_REGION ?? 'us-east-1';
export const x_api_key = process.env.X_API_KEY ?? '';
export const local_deployment_url = process.env.LOCAL_DEPLOYMENT_URL ?? '';
export const remote_deployment_url = process.env.REMOTE_DEPLOYMENT_URL ?? '';
export const local_langsmith_api_key = process.env.LOCAL_LANGSMITH_API_KEY ?? '';
export const remote_langsmith_api_key = process.env.REMOTE_LANGSMITH_API_KEY ?? '';
