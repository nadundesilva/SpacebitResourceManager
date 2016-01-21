<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function homeAction(Request $request)
    {
        return $this->render('default/home.html.twig');
    }

    public function contactUsAction(Request $request)
    {
        return $this->render('default/contactUs.html.twig');
    }
}
