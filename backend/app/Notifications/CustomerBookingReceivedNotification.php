<?php
namespace App\Notifications;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
class CustomerBookingReceivedNotification extends Notification { use Queueable; public function __construct(public Booking $booking){} public function via(object $notifiable):array{return ['mail'];} public function toMail(object $notifiable):MailMessage{return (new MailMessage)->subject('Crescent booking received — '.$this->booking->reference)->greeting('Your booking request has been received.')->line('Booking reference: '.$this->booking->reference)->line('Vehicle: '.($this->booking->vehicle?->name ?? 'Selected vehicle'))->line('Pickup: '.$this->booking->pickup_at?->format('d M Y, h:i A'))->line('Return: '.$this->booking->return_at?->format('d M Y, h:i A'))->line('Estimated total: PKR '.number_format((float)$this->booking->total_price,2))->action('View Booking Confirmation',config('app.frontend_url').'/booking-confirmation/'.$this->booking->reference)->line('Crescent Car Rental — Drive Your Next Story.');} }
