<?php
namespace App\Notifications;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
class CustomerBookingStatusNotification extends Notification { use Queueable; public function __construct(public Booking $booking,public string $oldStatus){} public function via(object $notifiable):array{return ['mail'];} public function toMail(object $notifiable):MailMessage{return (new MailMessage)->subject('Booking '.$this->booking->reference.' — '.$this->booking->status)->greeting('Booking status updated')->line('Your Crescent booking '.$this->booking->reference.' is now: '.$this->booking->status.'.')->line('Vehicle: '.($this->booking->vehicle?->name ?? 'Selected vehicle'))->action('View Booking',config('app.frontend_url').'/booking-confirmation/'.$this->booking->reference)->line('Crescent Car Rental — Drive Your Next Story.');} }
