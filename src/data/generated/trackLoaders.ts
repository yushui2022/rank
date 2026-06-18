import type { TrackDataset } from "../../types/rankingRuntime";

// Generated from outputs/019e910c-af91-7f70-b575-98ceeb8830a1/industry_rankings.
// Regenerate with: python scripts/generate_frontend_data.py

export type TrackDataModule = { trackDataset: TrackDataset };
export type TrackDataLoader = () => Promise<TrackDataModule>;

export const trackDataLoaders: Record<string, TrackDataLoader> = {
  "ai_agents_embodied_vla_top20": () => import("./tracks/ai_agents_embodied_vla_top20"),
  "ai_agents_enterprise_top20": () => import("./tracks/ai_agents_enterprise_top20"),
  "ai_agents_finance_top20": () => import("./tracks/ai_agents_finance_top20"),
  "ai_agents_general_llm_top20": () => import("./tracks/ai_agents_general_llm_top20"),
  "ai_agents_gov_office_top20": () => import("./tracks/ai_agents_gov_office_top20"),
  "ai_agents_media_top20": () => import("./tracks/ai_agents_media_top20"),
  "ai_agents_medical_top20": () => import("./tracks/ai_agents_medical_top20"),
  "ai_hardware_ai_chips_top20": () => import("./tracks/ai_hardware_ai_chips_top20"),
  "ai_hardware_compute_clusters_top20": () => import("./tracks/ai_hardware_compute_clusters_top20"),
  "ai_hardware_ai_servers_top20": () => import("./tracks/ai_hardware_ai_servers_top20"),
  "ai_hardware_supporting_components_top20": () => import("./tracks/ai_hardware_supporting_components_top20"),
  "ai_infra_dev_framework_top20": () => import("./tracks/ai_infra_dev_framework_top20"),
  "ai_infra_data_collection_labeling_top20": () => import("./tracks/ai_infra_data_collection_labeling_top20"),
  "ai_infra_specialized_industry_platforms_top20": () => import("./tracks/ai_infra_specialized_industry_platforms_top20"),
  "ai_trust_data_compliance_top20": () => import("./tracks/ai_trust_data_compliance_top20"),
  "ai_trust_model_deployment_services_top20": () => import("./tracks/ai_trust_model_deployment_services_top20"),
  "ai_trust_model_evaluation_top20": () => import("./tracks/ai_trust_model_evaluation_top20"),
  "ai_trust_model_safety_redteam_top20": () => import("./tracks/ai_trust_model_safety_redteam_top20"),
  "autonomous_driving_commercial_vehicles_top20": () => import("./tracks/autonomous_driving_commercial_vehicles_top20"),
  "autonomous_driving_cabin_llm_top20": () => import("./tracks/autonomous_driving_cabin_llm_top20"),
  "autonomous_driving_low_speed_delivery_top20": () => import("./tracks/autonomous_driving_low_speed_delivery_top20"),
  "autonomous_driving_passenger_fullstack_top20": () => import("./tracks/autonomous_driving_passenger_fullstack_top20"),
  "foundation_models_base_models_top20": () => import("./tracks/foundation_models_base_models_top20"),
  "foundation_models_biopharma_top20": () => import("./tracks/foundation_models_biopharma_top20"),
  "foundation_models_edge_small_models_top20": () => import("./tracks/foundation_models_edge_small_models_top20"),
  "foundation_models_embedding_top20": () => import("./tracks/foundation_models_embedding_top20"),
  "foundation_models_industrial_top20": () => import("./tracks/foundation_models_industrial_top20"),
  "foundation_models_math_science_top20": () => import("./tracks/foundation_models_math_science_top20"),
  "foundation_models_weather_geo_rs_top20": () => import("./tracks/foundation_models_weather_geo_rs_top20"),
  "generative_media_audio_video_models_top20": () => import("./tracks/generative_media_audio_video_models_top20"),
  "generative_media_digital_humans_top20": () => import("./tracks/generative_media_digital_humans_top20"),
  "generative_media_image_models_top20": () => import("./tracks/generative_media_image_models_top20"),
  "generative_media_interactive_content_top20": () => import("./tracks/generative_media_interactive_content_top20"),
  "robotics_bionic_top20": () => import("./tracks/robotics_bionic_top20"),
  "robotics_commercial_service_top20": () => import("./tracks/robotics_commercial_service_top20"),
  "robotics_home_consumer_top20": () => import("./tracks/robotics_home_consumer_top20"),
  "robotics_industrial_fixed_robots_top20": () => import("./tracks/robotics_industrial_fixed_robots_top20"),
  "robotics_mobile_robots_top20": () => import("./tracks/robotics_mobile_robots_top20"),
  "robotics_support_services_top20": () => import("./tracks/robotics_support_services_top20"),
  "robotics_specialized_industry_top20": () => import("./tracks/robotics_specialized_industry_top20"),
};
