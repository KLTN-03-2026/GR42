import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ExternalLink,
    Share2,
    Heart,
    Sparkles,
    TrendingUp,
    Clock,
    Loader2,
    Volume2,
    ThumbsUp,
    MessageCircle,
    Send,
    AlertCircle,
    X
} from 'lucide-react';
import { NewsItem } from '../components/NewsCard';
import { AnimatePresence, motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import VButton from '../components/VButton';
import VAvatar from '../components/VAvatar';
import { CategoryBadge } from '../components/CategoryUI';
import { decodeId } from '../utils/idEncoder';

const ArticleDetail = () => {
    const { id: encodedId } = useParams();
    const id = decodeId(encodedId || '');
    const navigate = useNavigate();
    const [article, setArticle] = useState<any>(null);
    const [related, setRelated] = useState<NewsItem[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [isFav, setIsFav] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [aiSummary, setAiSummary] = useState<string>('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(null);
    const [replyComment, setReplyComment] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);
    const [readingIndex, setReadingIndex] = useState<number | null>(null);
    const [isReadingAll, setIsReadingAll] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDetails, setReportDetails] = useState('');
    const [submittingReport, setSubmittingReport] = useState(false);

    const reportReasons = [
        "Nội dung sai sự thật",
        "Nội dung nhạy cảm, bạo lực",
        "Vi phạm bản quyền",
        "Ngôn từ thù ghét",
        "Spam hoặc lừa đảo",
        "Khác"
    ];

    const token = localStorage.getItem('auth_token');

    const fetchData = async () => {
        try {
            setLoading(true);
            const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
            
            const res = await axios.get(`${host}/BE/modules/api/news_get_detail.php`, {
                params: { id, token }
            });

            if (res.data.status === 'success') {
                const { data } = res.data;
                setArticle(data);
                setIsFav(data.is_favourite === true || Number(data.is_favourite) === 1 || data.is_favourite === '1');
                setComments(data.comments || []);
                setRelated(data.related || []);
            }
        } catch (error) {
            console.error('Error fetching article data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAiSummary = async (newsId: string) => {
        try {
            setIsSummaryLoading(true);
            const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
            
            const res = await axios.get(`${host}/BE/index.php`, {
                params: {
                    module: 'api',
                    action: 'ai_summary',
                    news_id: newsId
                }
            });
            if (res.data.status === 'success') {
                let summary = res.data.summary || '';
                summary = summary.replace(/```html|```/g, '').trim();
                setAiSummary(summary);
            } else {
                setAiSummary('Không thể tạo tóm tắt vào lúc này.');
            }
        } catch (error) {
            console.error('Error fetching AI summary:', error);
            setAiSummary('Lỗi kết nối API AI.');
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const cleanContent = (html: string) => {
        if (!html) return '';
        
        let cleaned = html;
        cleaned = cleaned.replace(/id="maincontent">/g, '');
        cleaned = cleaned.replace(/<div[^>]*id="maincontent"[^>]*>/g, '');
        
        return cleaned;
    };

    useEffect(() => {
        if (id) {
            fetchData();
            fetchAiSummary(id);
            window.scrollTo(0, 0);
        }
    }, [id, token]);

    const handleToggleLike = async () => {
        if (!token) {
            alert('Vui lòng đăng nhập để yêu thích bài báo');
            return;
        }
        if (isLiking) return;

        try {
            setIsLiking(true);
            const res = await axios.post(`${API_BASE_URL}/index.php?module=api&action=favorites`, {
                news_id: Number(id),
                token: token,
                action_type: 'toggle'
            });

            if (res.data.status === 'success') {
                setIsFav(res.data.action === 'added');
            } else {
                alert(res.data.message || 'Không thể thực hiện yêu thích bài báo này.');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent, pId: number | null = null) => {
        if (e) e.preventDefault();
        if (!token) {
            alert('Vui lòng đăng nhập để bình luận');
            return;
        }
        
        const content = pId ? replyComment : newComment;
        if (!content.trim()) return;
        if (pId ? submittingReply : submittingComment) return;

        try {
            if (pId) setSubmittingReply(true);
            else setSubmittingComment(true);

            const res = await axios.post(`${API_BASE_URL}/index.php?module=api&action=comments`, {
                news_id: id,
                content: content,
                parent_id: pId,
                token: token,
                action_type: 'add'
            });

            if (res.data.status === 'success') {
                setComments(prev => [...prev, res.data.data]);
                if (pId) {
                    setReplyComment('');
                    setReplyTo(null);
                } else {
                    setNewComment('');
                }
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            if (pId) setSubmittingReply(false);
            else setSubmittingComment(false);
        }
    };

    const handleLikeComment = async (commentId: number) => {
        if (!token) {
            alert('Vui lòng đăng nhập để thích bình luận');
            return;
        }
        try {
            const res = await axios.post(`${API_BASE_URL}/index.php?module=api&action=comments`, {
                comment_id: commentId,
                action_type: 'like',
                token: token
            });
            if (res.data.status === 'success') {
                setComments(prev => prev.map(c => 
                    c.id === commentId 
                        ? { ...c, is_liked: res.data.action === 'liked' ? 1 : 0, like_count: res.data.like_count } 
                        : c
                ));
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const handleReplyClick = (comment: any) => {
        if (!token) {
            alert('Vui lòng đăng nhập để phản hồi');
            return;
        }
        setReplyTo({ id: comment.id, name: comment.fullname });
        setReplyComment('');
    };

    const handleSpeak = (text: string, index: number, autoNext = false) => {
        window.speechSynthesis.cancel();
        
        if (readingIndex === index && !autoNext) {
            setReadingIndex(null);
            setIsReadingAll(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 1.1;
        
        utterance.onstart = () => setReadingIndex(index);
        utterance.onend = () => {
            setReadingIndex(null);
            if (isReadingAll || autoNext) {
                const nextParaIndex = contentBlocks.findIndex((b, i) => i > index && b.type === 'p');
                if (nextParaIndex !== -1) {
                    handleSpeak(contentBlocks[nextParaIndex].text!, nextParaIndex, true);
                } else {
                    setIsReadingAll(false);
                }
            }
        };

        window.speechSynthesis.speak(utterance);
    };

    const handleReadAll = () => {
        if (isReadingAll) {
            window.speechSynthesis.cancel();
            setIsReadingAll(false);
            setReadingIndex(null);
        } else {
            const firstParaIndex = contentBlocks.findIndex(b => b.type === 'p');
            if (firstParaIndex !== -1) {
                setIsReadingAll(true);
                handleSpeak(contentBlocks[firstParaIndex].text!, firstParaIndex, true);
            }
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: article?.title || 'Vertex News',
            text: article?.description || 'Xem tin tức mới nhất trên Vertex News',
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Error sharing:', error);
                copyToClipboard();
            }
        } else {
            copyToClipboard();
        }
    };

    const handleReportSubmit = async () => {
        if (!token) {
            alert('Vui lòng đăng nhập để báo cáo bài viết');
            return;
        }
        if (!reportReason) {
            alert('Vui lòng chọn lý do báo cáo');
            return;
        }

        try {
            setSubmittingReport(true);
            const res = await axios.post(`${API_BASE_URL}/modules/api/reports.php`, {
                news_id: id,
                reason: reportReason,
                details: reportDetails,
                token: token
            });

            if (res.data.status === 'success') {
                alert(res.data.message);
                setShowReportModal(false);
                navigate('/');
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error('Error reporting article:', error);
            alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setSubmittingReport(false);
        }
    };

    const copyToClipboard = () => {
        try {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('🚀 Đã sao chép liên kết vào bộ nhớ tạm!');
            } else {
                throw new Error('Clipboard API not available');
            }
        } catch (err) {
            console.error('Copy failed:', err);
            alert('Không thể tự động sao chép. Bạn hãy copy link trên thanh địa chỉ nhé!');
        }
    };

    const parseContent = (html: string) => {
        const regex = /<(p|figure)[^>]*>([\s\S]*?)<\/\1>/g;
        const blocks = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            blocks.push({
                type: match[1],
                content: match[0],
                text: match[1] === 'p' ? match[2].replace(/<[^>]*>/g, '').trim() : null
            });
        }
        return blocks;
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
    const contentBlocks = parseContent(cleanedContent);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 font-inter">
                <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] mb-8 md:mb-12 text-slate-400">
                    <Link to="/" className="hover:text-blue-600 transition-colors">TRANG CHỦ</Link>
                    <span className="text-slate-200">/</span>
                    <CategoryBadge name={article.category} />
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
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Nguồn:</span>
                                <h4 className="text-sm font-black text-slate-900 leading-none uppercase">{article.source}</h4>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{article.pubDate}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <VButton
                                variant={isReadingAll ? 'primary' : 'secondary'}
                                size="sm"
                                icon={Volume2}
                                onClick={handleReadAll}
                                className={isReadingAll ? 'animate-pulse' : ''}
                            >
                                {isReadingAll ? 'Đang đọc...' : 'Nghe bài báo'}
                            </VButton>
                            <div className="h-6 w-px bg-slate-100 mx-2"></div>
                            <div className="flex items-center gap-3">
                                <VButton 
                                    variant={isFav ? 'primary' : 'ghost'} 
                                    onClick={handleToggleLike}
                                    loading={isLiking}
                                    className={`w-11 h-11 rounded-full p-0 flex items-center justify-center transition-all ${isFav ? 'text-white bg-red-500 hover:bg-red-600 border-red-500 shadow-xl shadow-red-200' : 'text-slate-400 bg-slate-50 border border-slate-100 hover:bg-white hover:text-blue-600'}`}
                                >
                                    <Heart size={22} fill={isFav ? 'currentColor' : 'none'} />
                                </VButton>
                                <VButton 
                                    variant="ghost" 
                                    onClick={handleShare}
                                    className="w-11 h-11 rounded-full p-0 flex items-center justify-center text-slate-400 bg-slate-50 border border-slate-100 hover:bg-white hover:text-blue-600 transition-all"
                                    title="Chia sẻ"
                                >
                                    <Share2 size={22} />
                                </VButton>
                                <VButton 
                                    variant="ghost" 
                                    onClick={() => setShowReportModal(true)}
                                    className="w-11 h-11 rounded-full p-0 flex items-center justify-center text-slate-400 bg-slate-50 border border-slate-100 hover:bg-white hover:text-red-500 transition-all"
                                    title="Báo cáo bài viết"
                                >
                                    <AlertCircle size={22} />
                                </VButton>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-16 pb-20 border-b border-slate-100">
                    <div className="lg:col-span-8 flex flex-col items-start">
                        {article.image && !article.image.includes('placeholder') && article.image !== '' ? (
                            <div className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden mb-16 bg-slate-100 border border-slate-50 shadow-2xl relative">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                                <button 
                                    onClick={() => window.open(article.link, '_blank')}
                                    className="absolute bottom-6 right-6 px-6 py-3 bg-white/90 backdrop-blur-md rounded-2xl text-xs font-black text-slate-900 border border-white shadow-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                                >
                                    <ExternalLink size={14} />
                                    XEM TẠI NGUỒN
                                </button>
                            </div>
                        ) : (
                            <div className="mb-10 w-full flex justify-end">
                                <button 
                                    onClick={() => window.open(article.link, '_blank')}
                                    className="px-6 py-3 bg-slate-50 rounded-2xl text-xs font-black text-slate-900 border border-slate-100 shadow-sm hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                                >
                                    <ExternalLink size={14} />
                                    XEM TẠI NGUỒN
                                </button>
                            </div>
                        )}

                        <div className="w-full">
                            <article className="prose prose-slate md:prose-lg max-w-none prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:font-medium prose-headings:font-black prose-headings:tracking-tighter prose-img:rounded-[2rem] prose-img:shadow-xl">
                                <div className="space-y-6">
                                    {contentBlocks.map((block, idx) => (
                                        <div key={idx} className="relative group/para">
                                            <div dangerouslySetInnerHTML={{ __html: block.content }} />
                                            {block.type === 'p' && block.text && (
                                                <button 
                                                    onClick={() => handleSpeak(block.text!, idx)}
                                                    className={`absolute -right-10 top-2 p-2 rounded-full transition-all flex items-center justify-center ${readingIndex === idx ? 'text-blue-600 bg-blue-50 scale-110 shadow-sm' : 'opacity-0 group-hover/para:opacity-100 text-slate-300 hover:text-blue-600 hover:bg-slate-50'}`}
                                                    title="Đọc đoạn này"
                                                >
                                                    <Volume2 size={14} className={readingIndex === idx ? 'animate-pulse' : ''} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Nguồn tham khảo: {article.source}</p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Chia sẻ:</span>
                                        <div className="flex gap-2">
                                            <button onClick={handleShare} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer"><Share2 size={12} /></button>
                                            <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all cursor-pointer font-bold text-[10px]">f</button>
                                            <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer font-bold text-[10px]">𝕏</button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>

                    <aside className="lg:col-span-4 space-y-12">
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-[#F2F7FF] rounded-[2.5rem] p-8 border border-blue-50 shadow-xl shadow-blue-100/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Sparkles size={18} className="text-blue-600 animate-pulse" />
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Tóm tắt thông minh AI</span>
                                    </div>
                                    {isSummaryLoading ? (
                                        <div className="flex flex-col gap-4 mb-8">
                                            <div className="h-4 bg-blue-100/50 animate-pulse rounded-full w-full"></div>
                                            <div className="h-4 bg-blue-100/50 animate-pulse rounded-full w-[90%]"></div>
                                            <div className="h-4 bg-blue-100/50 animate-pulse rounded-full w-[80%]"></div>
                                        </div>
                                    ) : (
                                        <div 
                                            className="text-xs font-bold text-slate-600 leading-relaxed italic mb-8 whitespace-pre-wrap ai-summary-content max-h-[400px] overflow-y-auto no-scrollbar"
                                            dangerouslySetInnerHTML={{ __html: aiSummary || article.description || 'Đang cập nhật tóm tắt thông minh cho bài viết này...' }}
                                        />
                                    )}
                                    
                                    <VButton 
                                        variant="primary" fullWidth 
                                        icon={MessageCircle} 
                                        className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                                        onClick={() => {
                                            const event = new CustomEvent('openChatbotWithContext', { 
                                                detail: { 
                                                    title: article?.title,
                                                    summary: aiSummary || article?.description || 'Chưa có thông tin tóm tắt.'
                                                } 
                                            });
                                            window.dispatchEvent(event);
                                        }}
                                    >
                                        Hỏi AI chi tiết hơn
                                    </VButton>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-xs mb-8 flex items-center gap-3 text-blue-600">
                                    <TrendingUp size={16} />
                                    Có thể bạn quan tâm
                                </h4>
                                <div className="space-y-8">
                                    {related.map((item) => (
                                        <div key={item.id} className="group flex gap-4 items-center cursor-pointer" onClick={() => navigate(`/article/${item.id}`)}>
                                            {item.image && !item.image.includes('placeholder') && item.image !== '' && (
                                                <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50 shadow-sm group-hover:shadow-lg transition-all">
                                                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-1">{item.category}</span>
                                                <h5 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{item.title}</h5>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                <section id="comments" className="mt-20 max-w-4xl">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-10 flex items-center gap-3">
                        <MessageCircle size={24} className="text-blue-600" />
                        Thảo luận ({comments.length})
                    </h2>

                    <div id="comment-form" className="mb-16">
                        <form onSubmit={(e) => handleAddComment(e)} className="relative group">
                            <textarea 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={token ? "Chia sẻ quan điểm của bạn..." : "Vui lòng đăng nhập để bình luận"}
                                disabled={!token || submittingComment}
                                className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none min-h-[120px] resize-none"
                            />
                            <div className="absolute bottom-6 right-6">
                                <VButton
                                    type="submit"
                                    variant="primary"
                                    icon={Send}
                                    loading={submittingComment}
                                    disabled={!token || !newComment.trim()}
                                    className="w-14 h-14 rounded-2xl p-0 flex items-center justify-center"
                                />
                            </div>
                        </form>
                    </div>

                    <div className="space-y-12">
                        {comments.length > 0 ? comments.filter(c => !c.parent_id).map((comment) => (
                            <div key={comment.id} className="space-y-8">
                                <div className="flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <VAvatar src={comment.avatar} name={comment.fullname} size="md" className="rounded-2xl" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-black text-sm text-slate-900">{comment.fullname}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{comment.created_at}</span>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-4 font-medium">{comment.content}</p>
                                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <button 
                                                className={`flex items-center gap-1.5 transition-colors ${Number(comment.is_liked) === 1 ? 'text-blue-600' : 'hover:text-blue-600'}`}
                                                onClick={() => handleLikeComment(comment.id)}
                                            >
                                                <ThumbsUp size={14} className={Number(comment.is_liked) === 1 ? 'fill-current' : ''} /> 
                                                {Number(comment.like_count) > 0 && comment.like_count} Thích
                                            </button>
                                            <button 
                                                className={`transition-colors ${replyTo?.id === comment.id ? 'text-blue-600' : 'hover:text-blue-600'}`}
                                                onClick={() => handleReplyClick(comment)}
                                            >
                                                Phản hồi
                                            </button>
                                            <button 
                                                className="hover:text-red-500 transition-colors flex items-center gap-1"
                                                onClick={() => alert('Đã gửi báo cáo bình luận này.')}
                                            >
                                                <AlertCircle size={14} /> Báo cáo
                                            </button>
                                        </div>

                                        {/* Inline Reply Form */}
                                        {replyTo?.id === comment.id && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                                className="mt-6 flex gap-4"
                                            >
                                                <div className="flex-1 relative">
                                                    <textarea 
                                                        value={replyComment}
                                                        onChange={(e) => setReplyComment(e.target.value)}
                                                        placeholder={`Phản hồi ${comment.fullname}...`}
                                                        autoFocus
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none min-h-[80px] resize-none"
                                                    />
                                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                                        <VButton variant="ghost" size="sm" onClick={() => setReplyTo(null)}>Hủy</VButton>
                                                        <VButton variant="primary" size="sm" onClick={() => handleAddComment(null as any, comment.id)} loading={submittingReply} disabled={!replyComment.trim()}>Gửi</VButton>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="ml-16 space-y-8 border-l-2 border-slate-50 pl-8">
                                    {comments.filter(reply => reply.parent_id == comment.id).map(reply => (
                                        <div key={reply.id} className="flex gap-4">
                                            <VAvatar src={reply.avatar} name={reply.fullname} size="sm" className="rounded-xl" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-black text-[12px] text-slate-900">{reply.fullname}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{reply.created_at}</span>
                                                </div>
                                                <p className="text-slate-500 text-xs leading-relaxed mb-3 font-medium">{reply.content}</p>
                                                <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                    <button 
                                                        className={`flex items-center gap-1 transition-colors ${Number(reply.is_liked) === 1 ? 'text-blue-600' : 'hover:text-blue-600'}`}
                                                        onClick={() => handleLikeComment(reply.id)}
                                                    >
                                                        <ThumbsUp size={12} className={Number(reply.is_liked) === 1 ? 'fill-current' : ''} /> 
                                                        {Number(reply.like_count) > 0 && reply.like_count} Thích
                                                    </button>
                                                    <button 
                                                        className="hover:text-red-500 transition-colors flex items-center gap-1"
                                                        onClick={() => alert('Đã gửi báo cáo phản hồi này.')}
                                                    >
                                                        <AlertCircle size={12} /> Báo cáo
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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

            <AnimatePresence>
                {showReportModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowReportModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -z-10 translate-x-16 -translate-y-16"></div>
                            
                            <div className="flex justify-between items-center mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Báo cáo bài viết</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giúp chúng tôi cải thiện môi trường tin tức</p>
                                </div>
                                <button onClick={() => setShowReportModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-3">
                                    {reportReasons.map((reason) => (
                                        <button
                                            key={reason}
                                            onClick={() => setReportReason(reason)}
                                            className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                                                reportReason === reason 
                                                ? 'border-blue-600 bg-blue-50/50 text-blue-600' 
                                                : 'border-slate-50 bg-slate-50/30 text-slate-500 hover:border-slate-100'
                                            }`}
                                        >
                                            {reason}
                                            {reportReason === reason && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chi tiết thêm (Không bắt buộc)</label>
                                    <textarea 
                                        value={reportDetails}
                                        onChange={(e) => setReportDetails(e.target.value)}
                                        placeholder="Cung cấp thêm thông tin về báo cáo của bạn..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none min-h-[100px] resize-none"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <VButton 
                                        variant="outline" fullWidth onClick={() => setShowReportModal(false)}
                                        className="py-4"
                                    >
                                        Hủy bỏ
                                    </VButton>
                                    <VButton 
                                        variant="primary" fullWidth 
                                        onClick={handleReportSubmit}
                                        loading={submittingReport}
                                        className="py-4 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100"
                                    >
                                        Gửi báo cáo
                                    </VButton>
                                </div>
                                <p className="text-[9px] text-center font-bold text-slate-400 italic">
                                    * Lưu ý: Sau khi báo cáo, bài viết này sẽ bị ẩn khỏi dòng thời gian của bạn.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ArticleDetail;
