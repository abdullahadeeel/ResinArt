import React, { useState, useEffect } from 'react';
import { FiStar, FiThumbsUp, FiCheckCircle, FiClock } from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0, ratingDistribution: {} });
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userReview, setUserReview] = useState(null);
    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        comment: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);  // ✅ Moved here

    useEffect(() => {
        fetchReviews();
        checkUserReview();
    }, [productId, sortBy, page]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/reviews/product/${productId}?sort=${sortBy}&page=${page}`);
            if (response.data.success) {
                if (page === 1) {
                    setReviews(response.data.data);
                } else {
                    setReviews(prev => [...prev, ...response.data.data]);
                }
                setStats(response.data.stats);
                setHasMore(response.data.data.length === 10);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkUserReview = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await API.get('/reviews/my-reviews');
                const userReviewData = response.data.data.find(r => r.product?._id === productId || r.product === productId);
                setUserReview(userReviewData);
            }
        } catch (error) {
            console.error('Error checking user review:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const response = await API.post(`/reviews/product/${productId}`, formData);
            if (response.data.success) {
                toast.success('Review added successfully!');
                setShowReviewForm(false);
                setFormData({ rating: 5, title: '', comment: '' });
                fetchReviews();
                checkUserReview();
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleHelpful = async (reviewId) => {
        try {
            const response = await API.put(`/reviews/${reviewId}/helpful`);
            if (response.data.success) {
                setReviews(reviews.map(r => 
                    r._id === reviewId ? { ...r, helpful: response.data.helpful } : r
                ));
                toast.success('Thanks for your feedback!');
            }
        } catch (error) {
            console.error('Error marking helpful:', error);
        }
    };

    const renderStars = (rating) => {
        return (
            <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <FiStar
                        key={star}
                        size={16}
                        fill={star <= rating ? '#f59e0b' : 'none'}
                        color={star <= rating ? '#f59e0b' : '#e5d5cc'}
                        style={{ cursor: 'pointer' }}
                    />
                ))}
            </div>
        );
    };

    // ✅ Fixed: Now using hoverRating from component state
    const renderRatingInput = () => {
        return (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <FiStar
                        key={star}
                        size={32}
                        fill={(hoverRating || formData.rating) >= star ? '#f59e0b' : 'none'}
                        color="#f59e0b"
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setFormData({ ...formData, rating: star })}
                    />
                ))}
            </div>
        );
    };

    return (
        <div style={{ marginTop: '48px' }}>
            {/* Reviews Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '500', color: '#2d1f12' }}>
                        Customer Reviews
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '28px', fontWeight: '600', color: '#f59e0b' }}>
                                {stats.averageRating || 0}
                            </span>
                            {renderStars(Math.round(stats.averageRating))}
                        </div>
                        <span style={{ color: '#8b6b58' }}>
                            Based on {stats.totalReviews} reviews
                        </span>
                    </div>
                </div>
                
                {!userReview && !showReviewForm && (
                    <button
                        onClick={() => setShowReviewForm(true)}
                        style={{
                            padding: '10px 24px',
                            backgroundColor: '#9a3412',
                            color: 'white',
                            border: 'none',
                            borderRadius: '40px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div style={{
                    backgroundColor: '#fef7f0',
                    borderRadius: '20px',
                    padding: '24px',
                    marginBottom: '32px',
                    border: '1px solid #f0e4d8'
                }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px', color: '#2d1f12' }}>
                        Write Your Review
                    </h3>
                    <form onSubmit={handleSubmitReview}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#5c3a28' }}>Rating</label>
                            {renderRatingInput()}
                        </div>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#5c3a28' }}>Review Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Summarize your experience"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '40px',
                                    border: '1px solid #e5d5cc',
                                    backgroundColor: 'white',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#5c3a28' }}>Your Review</label>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                placeholder="What did you like or dislike? What would you tell others?"
                                rows="4"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '20px',
                                    border: '1px solid #e5d5cc',
                                    backgroundColor: 'white',
                                    fontSize: '14px',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    padding: '10px 24px',
                                    backgroundColor: '#9a3412',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '40px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowReviewForm(false)}
                                style={{
                                    padding: '10px 24px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #e5d5cc',
                                    borderRadius: '40px',
                                    cursor: 'pointer',
                                    color: '#5c3a28'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Sort Options */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <select
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                        setPage(1);
                    }}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '40px',
                        border: '1px solid #e5d5cc',
                        backgroundColor: 'white',
                        fontSize: '14px',
                        color: '#5c3a28'
                    }}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                    <option value="helpful">Most Helpful</option>
                </select>
            </div>

            {/* Reviews List */}
            {loading && page === 1 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #f0e4d8', borderTop: '3px solid #9a3412', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                </div>
            ) : reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fef7f0', borderRadius: '20px' }}>
                    <p style={{ color: '#8b6b58' }}>No reviews yet. Be the first to review this product!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {reviews.map(review => (
                        <div
                            key={review._id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '20px',
                                border: '1px solid #f0e4d8'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#fef3e8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#9a3412'
                                    }}>
                                        {review.userName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: '600', color: '#2d1f12' }}>{review.userName}</span>
                                            {review.isVerified && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981' }}>
                                                    <FiCheckCircle size={12} /> Verified Purchase
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                            {renderStars(review.rating)}
                                            <span style={{ fontSize: '12px', color: '#8b6b58' }}>
                                                <FiClock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#2d1f12' }}>
                                {review.title}
                            </h4>
                            <p style={{ color: '#6b4c3c', lineHeight: '1.6', marginBottom: '12px' }}>
                                {review.comment}
                            </p>
                            
                            <button
                                onClick={() => handleHelpful(review._id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px 12px',
                                    backgroundColor: '#fef7f0',
                                    border: 'none',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    color: '#8b6b58'
                                }}
                            >
                                <FiThumbsUp size={12} />
                                Helpful ({review.helpful || 0})
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Load More */}
            {hasMore && reviews.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={loading}
                        style={{
                            padding: '10px 32px',
                            backgroundColor: 'transparent',
                            border: '1px solid #9a3412',
                            borderRadius: '40px',
                            color: '#9a3412',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        {loading ? 'Loading...' : 'Load More Reviews'}
                    </button>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ProductReviews;