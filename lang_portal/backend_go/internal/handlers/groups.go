package handlers

import (
	"lang_portal/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func RegisterGroupsRoutes(r *gin.RouterGroup, svc *service.Service) {
	h := NewHandler(svc)
	groups := r.Group("/groups")
	{
		groups.GET("", h.ListGroups)
		groups.GET("/:id", h.GetGroup)
		groups.GET("/:id/words", h.GetGroupWords)
		groups.GET("/:id/study_sessions", h.GetGroupStudySessions)
		groups.POST("/:id/words", h.AddWordsToGroup)
	}
}

func (h *Handler) ListGroups(c *gin.Context) {
	page := c.DefaultQuery("page", "1")
	pageNum, _ := strconv.Atoi(page)

	groups, err := h.svc.ListGroups(pageNum)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, groups)
}

func (h *Handler) GetGroup(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	group, err := h.svc.GetGroup(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, group)
}

func (h *Handler) GetGroupWords(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	page := c.DefaultQuery("page", "1")
	pageNum, _ := strconv.Atoi(page)

	words, err := h.svc.GetGroupWords(id, pageNum)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, words)
}

func (h *Handler) GetGroupStudySessions(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	page := c.DefaultQuery("page", "1")
	pageNum, _ := strconv.Atoi(page)

	sessions, err := h.svc.GetGroupStudySessions(id, pageNum)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, sessions)
}

// AddWordsRequest represents the request body for adding words to a group
type AddWordsRequest struct {
	WordIDs []int64 `json:"word_ids" binding:"required"`
}

func (h *Handler) AddWordsToGroup(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group id"})
		return
	}

	var req AddWordsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	err = h.svc.AddWordsToGroup(id, req.WordIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}