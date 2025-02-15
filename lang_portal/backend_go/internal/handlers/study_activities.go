package handlers

import (
	"fmt"
	"lang_portal/internal/models"
	"lang_portal/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func RegisterStudyActivitiesRoutes(r *gin.RouterGroup, svc *service.Service) {
	h := NewHandler(svc)
	activities := r.Group("/study_activities")
	{
		activities.GET("", h.GetStudyActivities)
		activities.GET("/:id", h.GetStudyActivity)
		activities.GET("/:id/study_sessions", h.GetStudyActivitySessions)
		activities.POST("", h.CreateStudyActivity)
	}
}

func (h *Handler) GetStudyActivities(c *gin.Context) {
	page := c.DefaultQuery("page", "1")
	pageNum, _ := strconv.Atoi(page)

	activities, err := h.svc.GetStudyActivities(pageNum)
	if err != nil {
		fmt.Printf("Error getting study activities: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("Found %d study activities\n", len(activities.Items.([]*models.StudyActivity)))
	c.JSON(http.StatusOK, activities)
}

func (h *Handler) GetStudyActivity(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	activity, err := h.svc.GetStudyActivity(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, activity)
}

func (h *Handler) GetStudyActivitySessions(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	page := c.DefaultQuery("page", "1")
	pageNum, _ := strconv.Atoi(page)

	sessions, err := h.svc.GetStudyActivitySessions(id, pageNum)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, sessions)
}

func (h *Handler) CreateStudyActivity(c *gin.Context) {
	var req struct {
		GroupID         int64 `json:"group_id" binding:"required"`
		StudyActivityID int64 `json:"study_activity_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	session, err := h.svc.CreateStudySession(req.GroupID, req.StudyActivityID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, session)
}