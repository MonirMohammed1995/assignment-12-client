import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Trash2 } from 'lucide-react';

const AllReviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const api=import.meta.env.VITE_API_URL;
        fetch(`${api}/reviews`)
            .then(res => res.json())
            .then(data => setReviews(data));
    }, []);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm.isConfirmed) {
            const api=import.meta.env.VITE_API_URL;
            fetch(`${api}/reviews/${id}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    if (data.deletedCount > 0) {
                        Swal.fire('Deleted!', 'The review has been deleted.', 'success');
                        setReviews(reviews.filter(review => review._id !== id));
                    }
                });
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map(review => (
                    <div key={review._id} className="p-4 shadow-md rounded-xl">
                        <h3 className="text-lg font-semibold">{review.universityName}</h3>
                        {/* <p className="text-sm text-gray-600">Subject: {review.subjectCategory}</p> */}
                        <div className="flex items-center gap-3 mt-2">
                            <img
                                src={review.reviewerImage}
                                alt={review.reviewerName}
                                className="w-10 h-10 rounded-full border"
                            />
                            <div>
                                <p className="font-medium">{review.reviewerName}</p>
                                <p className="text-xs text-gray-500">{review.reviewDate}</p>
                            </div>
                        </div>
                        <p className="mt-2 text-sm">Rating: <span className="font-bold">{review.rating}</span></p>
                        <p className="text-gray-700 text-sm mt-2">{review.comments}</p>
                        <button
                            onClick={() => handleDelete(review._id)}
                            variant="destructive"
                            className="mt-4 w-full flex items-center justify-center gap-2"
                        >
                            <Trash2 size={16} /> Delete Review
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllReviews;