<?php
namespace App\Notifications;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
class AdminNewBookingNotification extends Notification { use Queueable; public function __construct(public Booking $booking){} public function via(object $notifiable):array{return ['database','mail'];} public function toDatabase(object $notifiable):array{return ['title'=>'New booking received','message'=>'New booking received: '.$this->booking->reference,'booking_id'=>$this->booking->id,'reference'=>$this->booking->reference];} public function toMail(object $notifiable):MailMessage{return (new MailMessage)->subject('New booking: '.$this->booking->reference)->greeting('New booking received')->line('Booking reference: '.$this->booking->reference)->line('Vehicle: '.($this->booking->vehicle?->name ?? 'Vehicle'))->line('Customer: '.($this->booking->customer?->full_name ?? 'Customer'))->line('Estimated total: PKR '.number_format((float)$this->booking->total_price,2))->action('Open Admin Dashboard',config('app.frontend_url').'/admin/bookings');} }
