import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardApi } from '@/services/api'

interface LastStudySession {
  id: number | null
  group_id: number | null
  activity_name: string | null
  group_name: string | null
  start_time: string | null
  end_time: string | null
  review_items_count: number
}

interface StudyProgress {
  total_words_studied: number
  total_available_words: number
}

interface QuickStats {
  success_rate: number
  total_study_sessions: number
  total_active_groups: number
  study_streak_days: number
}

export default function Dashboard() {
  const [lastSession, setLastSession] = useState<LastStudySession | null>(null)
  const [progress, setProgress] = useState<StudyProgress | null>(null)
  const [stats, setStats] = useState<QuickStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [lastSessionRes, progressRes, statsRes] = await Promise.all([
          dashboardApi.getLastStudySession(),
          dashboardApi.getStudyProgress(),
          dashboardApi.getQuickStats(),
        ])

        setLastSession(lastSessionRes.data)
        setProgress(progressRes.data)
        setStats(statsRes.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return 'Not available'
    try {
      return new Date(dateStr).toLocaleString()
    } catch (e) {
      console.error('Error formatting date:', e)
      return 'Invalid date'
    }
  }

  const NoDataMessage = () => (
    <div className="text-center py-8 text-muted-foreground">
      <p>No data available</p>
      <p className="text-sm mt-2">Start a study session to see your progress!</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Last Study Session</CardTitle>
        </CardHeader>
        <CardContent>
          {lastSession?.id ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Group</h3>
                {lastSession.group_id ? (
                  <Link
                    to={`/groups/${lastSession.group_id}`}
                    className="text-primary hover:underline"
                  >
                    {lastSession.group_name}
                  </Link>
                ) : (
                  <p className="text-muted-foreground">Not available</p>
                )}
              </div>
              <div>
                <h3 className="font-medium">Start Time</h3>
                <p className="text-muted-foreground">
                  {formatDate(lastSession.start_time)}
                </p>
              </div>
              <div>
                <h3 className="font-medium">End Time</h3>
                <p className="text-muted-foreground">
                  {formatDate(lastSession.end_time)}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Activity</h3>
                <p className="text-muted-foreground">
                  {lastSession.activity_name || 'Not available'}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Words Reviewed</h3>
                <p className="text-muted-foreground">
                  {lastSession.review_items_count}
                </p>
              </div>
            </div>
          ) : (
            <NoDataMessage />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {progress && progress.total_available_words > 0 ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    {progress.total_words_studied} of {progress.total_available_words} words studied
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round((progress.total_words_studied / progress.total_available_words) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${Math.round(
                        (progress.total_words_studied / progress.total_available_words) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <NoDataMessage />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {stats && stats.total_study_sessions > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Success Rate</h3>
                <p className="text-2xl font-bold">{Math.round(stats.success_rate)}%</p>
              </div>
              <div>
                <h3 className="font-medium">Study Sessions</h3>
                <p className="text-2xl font-bold">{stats.total_study_sessions}</p>
              </div>
              <div>
                <h3 className="font-medium">Active Groups</h3>
                <p className="text-2xl font-bold">{stats.total_active_groups}</p>
              </div>
              <div>
                <h3 className="font-medium">Study Streak</h3>
                <p className="text-2xl font-bold">{stats.study_streak_days} days</p>
              </div>
            </div>
          ) : (
            <NoDataMessage />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
