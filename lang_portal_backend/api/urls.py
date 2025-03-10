from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'study_activities', views.StudyActivityViewSet, basename='study_activities')
router.register(r'words', views.WordViewSet, basename='words')
router.register(r'study_sessions', views.StudySessionViewSet, basename='study_sessions')
router.register(r'groups', views.GroupViewSet, basename='groups')
router.register(r'vocabulary-quiz', views.VocabularyQuizViewSet, basename='vocabulary-quiz')

# First include the router URLs
urlpatterns = [
    # Dashboard endpoints
    path('dashboard/last_study_session/', views.last_study_session, name='last_study_session'),
    path('dashboard/study_progress/', views.study_progress, name='study_progress'),
    path('dashboard/quick-stats/', views.quick_stats, name='quick_stats'),
    # Study activity endpoints
    path('study_activities/<int:pk>/study_sessions/', 
         views.StudyActivityViewSet.as_view({'get': 'get_study_sessions'}),
         name='study_activity_sessions'),
    # Study session endpoints
    path('study_sessions/<int:pk>/words/', 
         views.StudySessionViewSet.as_view({'get': 'get_words'}),
         name='study_session_words'),
         
    # Listening practice endpoints
    path('listening/download-transcript', views.download_transcript, name='download_transcript'),
    path('listening/questions', views.get_listening_questions, name='get_listening_questions'),
    path('listening/transcript', views.get_transcript_and_stats, name='get_transcript_and_stats'),
    path('listening/search', views.search_transcripts, name='search_transcripts'),
    path('listening/test-bedrock', views.test_bedrock, name='test_bedrock'),
    path('listening/test-hindi-to-urdu', views.test_hindi_to_urdu, name='test_hindi_to_urdu'),
    
    # Include router URLs at the end
    path('', include(router.urls)),
]
