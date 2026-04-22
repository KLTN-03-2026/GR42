import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Calendar,
    ExternalLink,
    Share2,
    Heart,
    ArrowLeft,
    Sparkles,
    ChevronRight,
    TrendingUp,
    Clock,
    Loader2,
    Volume2,
    MoreHorizontal,
    ThumbsUp,
    MessageCircle,
    ArrowRight,
    Send
} from 'lucide-react';
import NewsCard, { NewsItem } from '../components/NewsCard';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<any>(null);
    const [related, setRelated] = useState<NewsItem[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [isFav, setIsFav] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const token = localStorage.getItem('auth_token');

    const fetchData = async () => {
        try {
            setLoading(true);
            const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
            
            // Unified call for detail, comments, and related news
            const res = await axios.get(`${host}/BE/modules/api/news_get_detail.php`, {
                params: { id, token }
            });

            if (res.data.status === 'success') {
                const { data } = res.data;
                setArticle(data);
                setIsFav(data.is_favourite);
                setComments(data.comments || []);
                setRelated(data.related || []);
            }
        } catch (error) {
            console.error('Error fetching article data:', error);
        } finally {
            setLoading(false);
        }
    };

    const cleanContent = (html: string) => {
        if (!html) return '';
        
        // Patterns that indicate the start of junk/footer content in scraped articles
        const junkMarkers = [
            'Bình luận',
            'Sao chép liên kết',
            'Xem thêm về',
            'Tin cùng chuyên mục',
            'Tin mới',
            '#maincontent',
            'id="maincontent">',
            'Vietnamnet',
            'VietNamNet',
            'Hotline:',
            'Email:',
            'Báo giá:',
            'Theo dõi VietNamNet trên'
        ];

        let cleaned = html;
        
        // Simple approach: if we find these markers as plain text or within tags, cut everything after them
        // This is a bit aggressive but helps with the "junk at bottom" issue
        for (const marker of junkMarkers) {
            const index = cleaned.indexOf(marker);
            if (index !== -1) {
                // If it's a marker like #maincontent, we might want to just remove the tag itself
                if (marker.startsWith('id="')) {
                    cleaned = cleaned.replace(marker, '');
                } else {
                    cleaned = cleaned.substring(0, index);
                }
            }
        }

        // Clean up common scraping artifacts
        cleaned = cleaned.replace(/id="maincontent">/g, '');
        cleaned = cleaned.replace(/<div[^>]*id="maincontent"[^>]*>/g, '');
        
        return cleaned;
    };

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleToggleLike = async () => {
        if (!token) {
            alert('Vui lòng đăng nhập để yêu thích bài báo');
            return;
        }
        if (isLiking) return;

        try {
            setIsLiking(true);
            const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
            const res = await axios.post(`${host}/BE/modules/api/favorites.php`, {
                news_id: id,
                token: token,
                action: 'toggle'
            });

            if (res.data.status === 'success') {
                setIsFav(res.data.action === 'added');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            alert('Vui lòng đăng nhập để bình luận');
            return;
        }
        if (!newComment.trim() || submittingComment) return;

        try {
            setSubmittingComment(true);
            const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
            const res = await axios.post(`${host}/BE/modules/api/comments.php`, {
                news_id: id,
                content: newComment,
                token: token,
                action: 'add'
            });

            if (res.data.status === 'success') {
                setComments([res.data.data, ...comments]);
                setNewComment('');
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 bg-background">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6 opacity-20" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải nội dung...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-40 text-center">
                <h1 className="text-2xl font-black text-slate-900 mb-4">Không tìm thấy bài báo</h1>
                <Link to="/" className="text-blue-600 font-bold uppercase text-xs tracking-widest">Trở về trang chủ</Link>
            </div>
        );
    }

    const cleanedContent = cleanContent(article.content);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 font-inter">
                <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] mb-8 md:mb-12 text-slate-400">
                    <Link to="/" className="hover:text-blue-600 transition-colors">TRANG CHỦ</Link>
                    <span className="text-slate-200">/</span>
                    <span className="text-blue-600 uppercase">{article.category}</span>
                    <span className="text-slate-200">/</span>
                    <span className="flex items-center gap-1.5 uppercase font-bold text-slate-300">
                        <Clock size={12} className="text-blue-600/50" />
                        {article.pubDate}
                    </span>
                </nav>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
            >
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 leading-[1.1] tracking-tighter">
                    {article.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-6 pb-12 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-full border-4 border-slate-50 flex items-center justify-center text-white font-bold uppercase">
                            {article.source.charAt(0)}
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-900 leading-none">{article.source}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{article.pubDate}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all text-xs font-black text-slate-400 uppercase tracking-widest border border-slate-100 shadow-sm shadow-slate-100">
                            <Volume2 size={16} />
                            Nghe bài báo
                        </button>
                        <div className="h-6 w-px bg-slate-100 mx-2"></div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={handleToggleLike}
                                disabled={isLiking}
                                className={`p-2 transition-all rounded-lg ${isFav ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'}`}
                            >
                                <Heart size={20} className={isFav ? 'fill-current' : ''} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all"><Share2 size={20} /></button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-16 pb-20 border-b border-slate-100">
                <div className="lg:col-span-8 flex flex-col items-start">
                    <div className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden mb-16 bg-slate-100 border border-slate-50 shadow-2xl relative">
                        <img
                            src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5a?q=80&w=2070&auto=format&fit=crop'}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                        <button 
                            onClick={() => window.open(article.link, '_blank')}
                            className="absolute bottom-6 right-6 px-6 py-3 bg-white/90 backdrop-blur-md rounded-2xl text-xs font-black text-slate-900 border border-white shadow-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                        >
                            <ExternalLink size={14} />
                            XEM BẢN GỐC
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 w-full">
                        <div className="md:col-span-4 bg-[#F2F7FF] rounded-[2rem] p-8 border border-blue-50 shadow-lg shadow-blue-50 relative overflow-hidden group h-fit sticky top-24">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center gap-2 mb-6">
                                    <Sparkles size={18} className="text-blue-600 animate-pulse" />
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Tóm tắt AI</span>
                                </div>
                                <p className="text-xs font-bold text-slate-600 leading-relaxed italic mb-8">
                                    {article.description || 'Đang cập nhật tóm tắt thông minh cho bài viết này...'}
                                </p>
                                <div className="mt-4 pt-6 border-t border-blue-600/10">
                                    <p className="text-[9px] font-black italic text-blue-600 uppercase tracking-widest leading-relaxed text-right">Gemini AI Analysis</p>
                                </div>
                            </div>
                        </div>

                        <article className="md:col-span-8 prose prose-slate md:prose-lg max-w-none prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:font-medium prose-headings:font-black prose-headings:tracking-tighter prose-img:rounded-[2rem] prose-img:shadow-xl">
                            <div dangerouslySetInnerHTML={{ __html: cleanedContent }} />
                            
                            <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Nguồn tham khảo: {article.source}</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Chia sẻ:</span>
                                    <div className="flex gap-2">
                                        {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer"><Share2 size={12} /></div>)}
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>

                <aside className="lg:col-span-4 space-y-12">
                    <div>
                        <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-xs mb-8 flex items-center gap-3 text-blue-600">
                            <TrendingUp size={16} />
                            Có thể bạn quan tâm
                        </h4>
                        <div className="space-y-8">
                            {related.map((item) => (
                                <div key={item.id} className="group flex gap-4 items-center cursor-pointer" onClick={() => navigate(`/article/${item.id}`)}>
                                    <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50 shadow-sm group-hover:shadow-lg transition-all">
                                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-1">{item.category}</span>
                                        <h5 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{item.title}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-blue-200/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-4 tracking-tighter">Bạn muốn tóm tắt thêm?</h3>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
                                Chat với AI ngay
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            <section id="comments" className="mt-20 max-w-4xl">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-10 flex items-center gap-3">
                    <MessageCircle size={24} className="text-blue-600" />
                    Thảo luận ({comments.length})
                </h2>

                <form onSubmit={handleAddComment} className="mb-16">
                    <div className="relative group">
                        <textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={token ? "Chia sẻ quan điểm của bạn..." : "Vui lòng đăng nhập để bình luận"}
                            disabled={!token || submittingComment}
                            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none min-h-[120px] resize-none"
                        />
                        <button 
                            type="submit"
                            disabled={!token || !newComment.trim() || submittingComment}
                            className="absolute bottom-6 right-6 p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </form>

                <div className="space-y-12">
                    {comments.length > 0 ? comments.map((comment) => (
                        <div key={comment.id} className="flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black overflow-hidden shadow-sm flex-shrink-0">
                                {comment.avatar ? (
                                    <img src={comment.avatar} alt="AV" className="w-full h-full object-cover" />
                                ) : (
                                    comment.fullname.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-black text-sm text-slate-900">{comment.fullname}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{comment.created_at}</span>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-4 font-medium">{comment.content}</p>
                                <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><ThumbsUp size={14} /> Thích</button>
                                    <button className="hover:text-blue-600 transition-colors">Phản hồi</button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                            <p className="text-slate-400 font-bold mb-2">Hiện chưa có bình luận nào.</p>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Hãy là người đầu tiên chia sẻ cảm nghĩ!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    </div>
    );
};

export default ArticleDetail;

