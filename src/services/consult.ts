import type {
  DoctorPage,
  FollowType,
  Image,
  KnowledgePage,
  KnowledgeParams,
  PageParams,
  TopDep
} from '@/types/consult'
import { request } from '@/utils/request'

export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('/patient/home/knowledge', 'GET', params)

// 获取医生列表
export const getDoctorPage = (params: PageParams) =>
  request<DoctorPage>('/home/page/doc', 'GET', params)

// 关注 取关
export const followOrUnFollow = (id: string, type: FollowType = 'doc') =>
  request('like', 'POST', { id, type })

// 获取所有一级部门
export const getAllDep = () => request<TopDep[]>('dep/all')

// 上传图片
export const uploadImages = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('/upload', 'post', fd)
}
